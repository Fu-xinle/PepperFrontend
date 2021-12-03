import { Component, OnDestroy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  RowNode,
  GridApi,
  GridReadyEvent,
  ValueSetterParams,
  GetQuickFilterTextParams,
  ILoadingOverlayComp,
  INoRowsOverlayComp,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { IFlowModel, INameDescriptionNotification } from '../../shared/interface/system-manage.interface';
import { FlowManageService } from '../service/flow-manage.service';
import { FlowCrudOperationComponent } from './flow-crud-opeartion.component';

@Component({
  selector: 'app-flow-manage',
  templateUrl: './flow-manage.component.html',
  styleUrls: ['./flow-manage.component.scss'],
})
export class FlowManageComponent implements OnInit, OnDestroy {
  /**对话框模板引用,利用ngbModal创建对话框，创建流程、编辑流程信息、删除流程 */
  @ViewChild('editFlowContent') editFlowContent!: TemplateRef<void>;
  @ViewChild('deleteFlowContent') deleteFlowContent!: TemplateRef<void>;

  /**Ag-Grid表格列配置信息 */
  public columnDefs = [
    {
      headerName: '序号',
      field: 'id',
      initialWidth: 100,
      sortable: true,
      suppressMenu: true,
      sort: 'asc',
      unSortIcon: true,
      icons: {
        sortAscending: '<i class="icon-Up" style="font-weight: bold;"></i>',
        sortDescending: '<i class="icon-Down" style="font-weight: bold;"></i>',
        sortUnSort: '<i class="icon-Up--Down"></i>',
      },
    },
    {
      headerName: '名称',
      field: 'name',
      flex: 1,
      suppressMenu: true,
      sortable: true,
      unSortIcon: true,
      minWidth: 150,
      icons: {
        sortAscending: '<i class="icon-Up" style="font-weight: bold;"></i>',
        sortDescending: '<i class="icon-Down" style="font-weight: bold;"></i>',
        sortUnSort: '<i class="icon-Up--Down"></i>',
      },
      editable: true,
      valueSetter: (params: ValueSetterParams) => {
        if (params.newValue !== params.oldValue) {
          params['data'][params['colDef']['field']!] = params.newValue;
          this.onlineEdit(params);
          return true;
        } else {
          return false;
        }
      },
    },
    {
      headerName: '描述',
      field: 'description',
      suppressMenu: true,
      minWidth: 450,
      editable: true,
      flex: 2,
      cellEditor: 'agLargeTextCellEditor',
      valueSetter: (params: ValueSetterParams) => {
        if (params.newValue !== params.oldValue) {
          params['data'][params['colDef']['field']!] = params.newValue;
          this.onlineEdit(params);
          return true;
        } else {
          return false;
        }
      },
    },
    {
      headerName: '',
      suppressMenu: true,
      field: 'guid',
      initialWidth: 180,
      cellRenderer: 'flowCrudOperationComponent',
      getQuickFilterText: (_params: GetQuickFilterTextParams) => '',
    },
  ];

  /**Ag-Grid表格的加载显示和空数据显示,自定义重载相关变量 */
  public gridApi!: GridApi;
  public context = { componentParent: this };
  public frameworkComponents:
    | {
        [p: string]: {
          new (): any;
        };
      }
    | any;
  public loadingOverlayComponent:
    | {
        new (): ILoadingOverlayComp;
      }
    | string;
  public loadingOverlayComponentParams:
    | {
        loadingMessage: string;
      }
    | any;
  public noRowsOverlayComponent:
    | {
        new (): INoRowsOverlayComp;
      }
    | string;
  public noRowsOverlayComponentParams:
    | {
        noRowsMessageFunc: () => string;
      }
    | any;

  /**搜索框搜索关键字、Ag-Grid快速搜索关键字 */
  public keySearcchValue: string = '';
  public keySearcchValue$ = new Subject<string>();
  public quickFilterText: string = '';

  /**流程数据列表 */
  public flowData!: IFlowModel[];

  /**编辑流程:编辑的流程信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editFlowForm: FormGroup;
  public editFlowNotification: INameDescriptionNotification;
  public editFlowLoading: boolean = false;
  public editFlowLoadingText: string = '';

  /**删除流程:删除的流程信息(表中一行)、保存信息提示 */
  public deleteRowNode!: RowNode;
  public deleteFlowLoading: boolean = false;
  public deleteFlowLoadingText: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flowManageService: FlowManageService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    /**编辑流程变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editFlowNotification = {
      nameMessageShow: false,
      nameMessage: '请输入流程名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入流程描述',
    };

    this.editFlowForm = this.fb.group({
      name: [''],
      description: [''],
    });

    this.subscriptions.push(
      this.editFlowForm.controls['name'].valueChanges.subscribe((_value: string) => {
        this.editFlowNotification.nameMessageShow = false;
      })
    );

    this.subscriptions.push(
      this.editFlowForm.controls['description'].valueChanges.subscribe((_value: string) => {
        this.editFlowNotification.descriptionMessageShow = false;
      })
    );

    /**Ag-Grid表格的加载显示和空数据显示,自定义重载*/
    this.frameworkComponents = {
      flowCrudOperationComponent: FlowCrudOperationComponent,
      customLoadingOverlay: AppLoadingOverlayComponent,
      customNoRowsOverlay: AppNorowsOverlayComponent,
    };
    this.loadingOverlayComponent = 'customLoadingOverlay';
    this.loadingOverlayComponentParams = {
      loadingMessage: '加载中...',
    };
    this.noRowsOverlayComponent = 'customNoRowsOverlay';
    this.noRowsOverlayComponentParams = {
      noRowsMessageFunc: () => '暂无数据',
    };

    /**从服务器获取已有流程数据，显示在Ag-Grid表格中 */
    this.subscriptions.push(
      this.flowManageService.getAllFlows().subscribe({
        next: res => {
          this.flowData = res.flowData;
        },
        error: err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        complete: () => {
          /*Completed*/
        },
      })
    );
  }

  ngOnInit() {
    /**实现搜索框防抖功能 */
    this.subscriptions.push(
      this.keySearcchValue$.pipe(debounceTime(200), distinctUntilChanged()).subscribe(_res => {
        this.quickFilterText = this.keySearcchValue;
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.keySearcchValue$.complete();
  }

  /**
   * 创建流程转到流程设计页面
   */
  public createFlow() {
    this.router.navigate(['../../system-manage/flow-design', { guid: '' }], { relativeTo: this.activatedRoute });
  }

  /**
   * 利用ngbModal弹出编辑流程信息对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即编辑的流程信息
   */
  editFlow(rowNode: RowNode) {
    this.editFlowForm.controls['name'].setValue(rowNode.data.name);
    this.editFlowForm.controls['description'].setValue(rowNode.data.description);

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editFlowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editFlowLoading = false;
        this.editFlowForm.controls['name'].setValue('');
        this.editFlowForm.controls['description'].setValue('');
        Object.assign(this.editFlowNotification, {
          nameMessageShow: false,
          nameMessage: '请输入流程名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入流程描述',
        });
      }
    );
  }

  /**
   * 编辑流程对话框,单击保存事件，将修改保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  editFlowSave(modelRef: NgbModalRef) {
    /**判断名称不能为空，描述暂时不判断、可以为空 */
    const name: string = this.editFlowForm.value.name.toString().trim();
    if (name.length === 0) {
      this.editFlowNotification.nameMessageShow = true;
      this.editFlowNotification.nameMessage = '请输入流程名称';
      return;
    }

    this.editFlowLoading = true;
    this.editFlowLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editFlowForm.value.name.toString().trim();
    rowNode.data.description = this.editFlowForm.value.description.toString().trim();
    this.subscriptions.push(
      this.flowManageService.editFlow(rowNode.data).subscribe({
        next: _res => {
          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ update: [rowNode.data] });

          this.editFlowLoading = false;
          this.editFlowForm.controls['name'].setValue('');
          this.editFlowForm.controls['description'].setValue('');

          modelRef.close();
          this.toastr.success('流程信息修改成功!');
        },
        error: err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        complete: () => {
          /*Completed*/
        },
      })
    );
  }

  /**
   * 利用ngbModal弹出删除流程对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即删除的流程信息
   */
  deleteFlow(rowNode: RowNode) {
    this.deleteRowNode = rowNode;

    const modalReference = this.modalService.open(this.deleteFlowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.deleteFlowLoading = false;
      }
    );
  }

  /**
   * 删除流程对话框,单击保存事件，从数据库中删除流程数据
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  deleteFlowSave(modelRef: NgbModalRef) {
    this.deleteFlowLoading = true;
    this.deleteFlowLoadingText = '删除中...';

    const rowNode = this.deleteRowNode;

    /**保存到数据库 */
    this.subscriptions.push(
      this.flowManageService.deleteFlow(rowNode.data.guid).subscribe({
        next: _res => {
          /**更新Ag-Grid(由于删除一行，ID序号需要修改)、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ remove: [rowNode.data] });

          const updateRows: RowNode[] = [];
          this.gridApi.forEachNode((node, _index) => {
            if (parseInt(node.data.id, 10) > parseInt(rowNode.data.id, 10)) {
              node.data.id = parseInt(node.data.id, 10);
              updateRows.push(node);
            }
          });
          this.gridApi.applyTransaction({ update: updateRows });

          this.deleteFlowLoading = false;
          modelRef.close();
          this.toastr.success('流程信息删除成功!');
        },
        error: err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        complete: () => {
          /*Completed*/
        },
      })
    );
  }

  /**
   * Ag-Grid表格单元格在线编辑，将修改信息保存到数据库
   *
   * @param {ValueSetterParams} params params.data是表格行信息，还包含编辑前的值、编辑后的值等信息
   */
  onlineEdit(params: ValueSetterParams) {
    this.subscriptions.push(
      this.flowManageService.editFlow(params.data).subscribe({
        next: _res => {},
        error: err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        complete: () => {
          /*Completed*/
        },
      })
    );
  }

  /**
   * Ag-Grid初始化完成后回调函数
   *
   * @param {GridReadyEvent} params Paramater Ag-Grid对象
   */
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api!;
  }
}
