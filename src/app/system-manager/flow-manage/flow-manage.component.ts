import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  RowNode,
  GridApi,
  DetailGridInfo,
  ValueSetterParams,
  GetQuickFilterTextParams,
  ILoadingOverlayComp,
  INoRowsOverlayComp,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { IFlowModel, INameDescriptionNotification } from '../../shared/interface/system-manager.interface';
import { SystemManagerService } from '../system-manager.service';
import { FlowCrudOperationComponent } from './flow-crud-opeartion.component';

@Component({
  selector: 'app-flow-manage',
  templateUrl: './flow-manage.component.html',
  styleUrls: ['./flow-manage.component.scss'],
})
export class FlowManageComponent implements OnDestroy {
  @ViewChild('createFlowContent') createFlowContent!: TemplateRef<void>;
  @ViewChild('editFlowContent') editFlowContent!: TemplateRef<void>;
  @ViewChild('deleteFlowContent') deleteFlowContent!: TemplateRef<void>;

  // ag-grid配置信息
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
  public quickFilterText: string = '';

  // 流程记录数据
  public flowData!: IFlowModel[];

  // 创建新流程
  public createFlowNotification: INameDescriptionNotification;
  public createFlowForm: FormGroup;
  public createFlowLoading: boolean = false;
  public createFlowLoadingText: string = '';

  // 编辑流程信息
  public editFlowNotification: INameDescriptionNotification;
  public editFlowForm: FormGroup;
  public editFlowLoading: boolean = false;
  public editFlowLoadingText: string = '';
  public editRowNode!: RowNode;

  // 删除流程
  public deleteFlowLoading: boolean = false;
  public deleteFlowLoadingText: string = '';
  public deleteRowNode!: RowNode;

  private subscriptions: Subscription[] = [];

  constructor(
    private systemManagerService: SystemManagerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    // 创建新流程
    this.createFlowNotification = {
      nameMessageShow: false,
      nameMessage: '请输入流程名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入流程描述', // 流程描述暂时可以为空
    };

    this.createFlowForm = this.fb.group({
      name: [''],
      description: [''],
    });

    this.createFlowForm.controls['name'].valueChanges.subscribe((_value: string) => {
      this.createFlowNotification.nameMessageShow = false;
    });

    this.createFlowForm.controls['description'].valueChanges.subscribe((_value: string) => {
      this.createFlowNotification.descriptionMessageShow = false;
    });

    // 编辑流程信息
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

    this.editFlowForm.controls['name'].valueChanges.subscribe((_value: string) => {
      this.editFlowNotification.nameMessageShow = false;
    });

    this.editFlowForm.controls['description'].valueChanges.subscribe((_value: string) => {
      this.editFlowNotification.descriptionMessageShow = false;
    });

    // ag-grid
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

    // /从服务中获取所有流程信息
    this.subscriptions.push(
      this.systemManagerService.getAllFlows().subscribe(
        res => {
          this.flowData = res.flowData;
        },
        err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        () => {
          /*Completed*/
        }
      )
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * 创建新的流程信息,对话框模式
   *
   */
  createFlow() {
    const modalReference = this.modalService.open(this.createFlowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.createFlowLoading = false;
        this.createFlowForm.controls['name'].setValue('');
        this.createFlowForm.controls['description'].setValue('');
        Object.assign(this.createFlowNotification, {
          nameMessageShow: false,
          nameMessage: '请输入流程名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入流程描述',
        });
      }
    );
  }
  createFlowSave(modelRef: any) {
    // 首先判断名称不能为空，描述暂时不判断、可以为空
    const name: string = this.createFlowForm.value.name.toString().trim();
    if (name.length === 0) {
      this.createFlowNotification.nameMessageShow = true;
      this.createFlowNotification.nameMessage = '请输入流程名称';
      return;
    }

    this.createFlowLoading = true;
    this.createFlowLoadingText = '提交中...';

    // 保存到数据库
    const newFlowInfo = {
      id: this.flowData.length + 1,
      guid: uuidv4(),
      name: this.createFlowForm.value.name.toString().trim(),
      description: this.createFlowForm.value.description.toString().trim(),
    };
    this.subscriptions.push(
      this.systemManagerService.addFlow(newFlowInfo).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ add: [newFlowInfo] });
          this.createFlowLoading = false;
          this.createFlowForm.controls['name'].setValue('');
          this.createFlowForm.controls['description'].setValue('');
          modelRef.close();
          // 提示
          this.toastr.success('新流程添加成功!');
        },
        err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        () => {
          /*Completed*/
        }
      )
    );
  }

  editFlow(rowNode: any) {
    this.editFlowForm.controls['name'].setValue(rowNode.data.name);
    this.editFlowForm.controls['description'].setValue(rowNode.data.description);

    this.editRowNode = rowNode;
    // 设置初始值
    const modalReference = this.modalService.open(this.editFlowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
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
  editFlowSave(modelRef: any) {
    // 首先判断名称不能为空，描述暂时不判断、可以为空
    const name: string = this.editFlowForm.value.name.toString().trim();
    if (name.length === 0) {
      this.editFlowNotification.nameMessageShow = true;
      this.editFlowNotification.nameMessage = '请输入流程名称';
      return;
    }

    this.editFlowLoading = true;
    this.editFlowLoadingText = '提交中...';

    // 保存到数据库
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editFlowForm.value.name.toString().trim();
    rowNode.data.description = this.editFlowForm.value.description.toString().trim();
    this.subscriptions.push(
      this.systemManagerService.editFlow(rowNode.data).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ update: [rowNode.data] });
          this.editFlowLoading = false;
          this.editFlowForm.controls['name'].setValue('');
          this.editFlowForm.controls['description'].setValue('');

          modelRef.close();
          // 提示
          this.toastr.success('流程信息修改成功!');
        },
        err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        () => {
          /*Completed*/
        }
      )
    );
  }

  deleteFlow(rowNode: any) {
    this.deleteRowNode = rowNode;
    const modalReference = this.modalService.open(this.deleteFlowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.deleteFlowLoading = false;
      }
    );
  }
  deleteFlowSave(modelRef: any) {
    this.deleteFlowLoading = true;
    this.deleteFlowLoadingText = '删除中...';
    const rowNode = this.deleteRowNode;

    // 保存到数据库
    this.subscriptions.push(
      this.systemManagerService.deleteFlow(rowNode.data.guid).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ remove: [rowNode.data] });
          this.deleteFlowLoading = false;
          modelRef.close();

          const updateRows: RowNode[] = [];
          this.gridApi.forEachNode((node, _index) => {
            if (parseInt(node.data.id, 10) > parseInt(rowNode.data.id, 10)) {
              node.data.id = parseInt(node.data.id, 10);
              updateRows.push(node);
            }
          });
          this.gridApi.applyTransaction({ update: updateRows });

          // 提示
          this.toastr.success('流程信息删除成功!');
        },
        err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        () => {
          /*Completed*/
        }
      )
    );
  }

  onlineEdit(params: ValueSetterParams) {
    this.subscriptions.push(
      this.systemManagerService.editFlow(params.data).subscribe(
        _res => {},
        err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
          // 更新不成功应该退回??
        },
        () => {
          /*Completed*/
        }
      )
    );
  }

  onGridReady(params: DetailGridInfo) {
    this.gridApi = params.api!;
  }
}
