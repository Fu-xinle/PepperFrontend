import { Component, OnDestroy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
import { Subscription, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { IFlowModel, INameDescriptionNotification } from '../../shared/interface/system-manage.interface';
import { SystemManageService } from '../system-manage.service';
import { FormCrudOperationComponent } from './form-crud-opeartion.component';

@Component({
  selector: 'app-form-manage',
  templateUrl: './form-manage.component.html',
  styleUrls: ['./form-manage.component.scss'],
})
export class FormManageComponent implements OnInit, OnDestroy {
  /**对话框模板引用,利用ngbModal创建对话框，创建表单、编辑表单信息、删除表单 */
  @ViewChild('createFormContent') createFormContent!: TemplateRef<void>;
  @ViewChild('editFormContent') editFormContent!: TemplateRef<void>;
  @ViewChild('deleteFormContent') deleteFormContent!: TemplateRef<void>;

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
      editable: true,
      minWidth: 450,
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
      cellRenderer: 'formCrudOperationComponent',
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

  /**表单数据列表 */
  public formData!: IFlowModel[];

  /**创建表单:表单组件、表单信息提示、保存信息提示 */
  public createFormGroup: FormGroup;
  public createFormNotification: INameDescriptionNotification;
  public createFormLoading: boolean = false;
  public createFormLoadingText: string = '';

  /**编辑表单:编辑的表单信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editFormGroup: FormGroup;
  public editFormNotification: INameDescriptionNotification;
  public editFormLoading: boolean = false;
  public editFormLoadingText: string = '';

  /**删除表单:删除的表单信息(表中一行)、保存信息提示 */
  public deleteFormLoading: boolean = false;
  public deleteFormLoadingText: string = '';
  public deleteRowNode!: RowNode;

  private subscriptions: Subscription[] = [];

  constructor(
    private systemManageService: SystemManageService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    /**创建表单变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.createFormNotification = {
      nameMessageShow: false,
      nameMessage: '请输入表单名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入表单描述',
    };

    this.createFormGroup = this.fb.group({
      name: [''],
      description: [''],
    });

    this.createFormGroup.controls['name'].valueChanges.subscribe((_value: string) => {
      this.createFormNotification.nameMessageShow = false;
    });

    this.createFormGroup.controls['description'].valueChanges.subscribe((_value: string) => {
      this.createFormNotification.descriptionMessageShow = false;
    });

    /**编辑表单变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editFormNotification = {
      nameMessageShow: false,
      nameMessage: '请输入表单名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入表单描述',
    };

    this.editFormGroup = this.fb.group({
      name: [''],
      description: [''],
    });

    this.editFormGroup.controls['name'].valueChanges.subscribe((_value: string) => {
      this.editFormNotification.nameMessageShow = false;
    });

    this.editFormGroup.controls['description'].valueChanges.subscribe((_value: string) => {
      this.editFormNotification.descriptionMessageShow = false;
    });

    /**Ag-Grid表格的加载显示和空数据显示,自定义重载*/
    this.frameworkComponents = {
      formCrudOperationComponent: FormCrudOperationComponent,
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

    /**从服务器获取已有表单数据，显示在Ag-Grid表格中 */
    this.subscriptions.push(
      this.systemManageService.getAllForms().subscribe(
        res => {
          this.formData = res.formData;
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

  ngOnInit() {
    /**实现搜索框防抖功能 */
    this.keySearcchValue$.pipe(debounceTime(200), distinctUntilChanged()).subscribe(_res => {
      this.quickFilterText = this.keySearcchValue;
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * 利用ngbModal弹出创建表单对话框
   */
  createForm() {
    const modalReference = this.modalService.open(this.createFormContent, { centered: true, backdrop: 'static' });

    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.createFormLoading = false;
        this.createFormGroup.controls['name'].setValue('');
        this.createFormGroup.controls['description'].setValue('');
        Object.assign(this.createFormNotification, {
          nameMessageShow: false,
          nameMessage: '请输入表单名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入表单描述',
        });
      }
    );
  }

  /**
   * 创建表单对话框,单击保存事件，将新创建表单保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  createFormSave(modelRef: NgbModalRef) {
    /**判断名称不能为空，描述暂时不判断、可以为空 */
    const name: string = this.createFormGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.createFormNotification.nameMessageShow = true;
      this.createFormNotification.nameMessage = '请输入表单名称';
      return;
    }

    this.createFormLoading = true;
    this.createFormLoadingText = '提交中...';

    /**保存到数据库 */
    const newFormInfo = {
      id: this.formData.length + 1,
      guid: uuidv4(),
      name: this.createFormGroup.value.name.toString().trim(),
      description: this.createFormGroup.value.description.toString().trim(),
    };
    this.subscriptions.push(
      this.systemManageService.addForm(newFormInfo).subscribe({
        next: _res => {
          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ add: [newFormInfo] });

          this.createFormLoading = false;
          this.createFormGroup.controls['name'].setValue('');
          this.createFormGroup.controls['description'].setValue('');

          modelRef.close();
          this.toastr.success('新表单添加成功!');
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
   * 利用ngbModal弹出编辑表单信息对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即编辑的表单信息
   */
  editForm(rowNode: RowNode) {
    this.editFormGroup.controls['name'].setValue(rowNode.data.name);
    this.editFormGroup.controls['description'].setValue(rowNode.data.description);

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editFormContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editFormLoading = false;
        this.editFormGroup.controls['name'].setValue('');
        this.editFormGroup.controls['description'].setValue('');
        Object.assign(this.editFormNotification, {
          nameMessageShow: false,
          nameMessage: '请输入表单名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入表单描述',
        });
      }
    );
  }

  /**
   * 编辑表单对话框,单击保存事件，将修改保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  editFormSave(modelRef: NgbModalRef) {
    /**判断名称不能为空，描述暂时不判断、可以为空 */
    const name: string = this.editFormGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.editFormNotification.nameMessageShow = true;
      this.editFormNotification.nameMessage = '请输入表单名称';
      return;
    }

    this.editFormLoading = true;
    this.editFormLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editFormGroup.value.name.toString().trim();
    rowNode.data.description = this.editFormGroup.value.description.toString().trim();
    this.subscriptions.push(
      this.systemManageService.editForm(rowNode.data).subscribe({
        next: _res => {
          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ update: [rowNode.data] });

          this.editFormLoading = false;
          this.editFormGroup.controls['name'].setValue('');
          this.editFormGroup.controls['description'].setValue('');

          modelRef.close();
          this.toastr.success('表单信息修改成功!');
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
   * 利用ngbModal弹出删除表单对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即删除的表单信息
   */
  deleteForm(rowNode: RowNode) {
    this.deleteRowNode = rowNode;

    const modalReference = this.modalService.open(this.deleteFormContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.deleteFormLoading = false;
      }
    );
  }

  /**
   * 删除表单对话框,单击保存事件，从数据库中删除表单数据
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  deleteFormSave(modelRef: NgbModalRef) {
    this.deleteFormLoading = true;
    this.deleteFormLoadingText = '删除中...';

    const rowNode = this.deleteRowNode;

    /**保存到数据库 */
    this.subscriptions.push(
      this.systemManageService.deleteForm(rowNode.data.guid).subscribe({
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

          this.deleteFormLoading = false;
          modelRef.close();
          this.toastr.success('表单信息删除成功!');
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
      this.systemManageService.editForm(params.data).subscribe({
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
   * @param {DetailGridInfo} params Paramater Ag-Grid对象
   */
  onGridReady(params: DetailGridInfo) {
    this.gridApi = params.api!;
  }
}
