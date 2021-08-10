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
import { FormCrudOperationComponent } from './form-crud-opeartion.component';

@Component({
  selector: 'app-form-manage',
  templateUrl: './form-manage.component.html',
  styleUrls: ['./form-manage.component.scss'],
})
export class FormManageComponent implements OnDestroy {
  @ViewChild('createFormContent') createFormContent!: TemplateRef<void>;
  @ViewChild('editFormContent') editFormContent!: TemplateRef<void>;
  @ViewChild('deleteFormContent') deleteFormContent!: TemplateRef<void>;

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

  // 表单记录数据
  public formData!: IFlowModel[];

  // 创建新表单
  public createFormNotification: INameDescriptionNotification;
  public createFormGroup: FormGroup;
  public createFormLoading: boolean = false;
  public createFormLoadingText: string = '';

  // 编辑表单信息
  public editFormNotification: INameDescriptionNotification;
  public editFormGroup: FormGroup;
  public editFormLoading: boolean = false;
  public editFormLoadingText: string = '';
  public editRowNode!: RowNode;

  // 删除表单
  public deleteFormLoading: boolean = false;
  public deleteFormLoadingText: string = '';
  public deleteRowNode!: RowNode;

  private subscriptions: Subscription[] = [];

  constructor(
    private systemManagerService: SystemManagerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    // 创建新表单
    this.createFormNotification = {
      nameMessageShow: false,
      nameMessage: '请输入表单名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入表单描述', // 表单描述暂时可以为空
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

    // 编辑表单信息
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

    // ag-grid
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

    // /从服务中获取所有表单信息
    this.subscriptions.push(
      this.systemManagerService.getAllForms().subscribe(
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

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * 创建新的表单信息,对话框模式
   *
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
  createFormSave(modelRef: any) {
    // 首先判断名称不能为空，描述暂时不判断、可以为空
    const name: string = this.createFormGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.createFormNotification.nameMessageShow = true;
      this.createFormNotification.nameMessage = '请输入表单名称';
      return;
    }

    this.createFormLoading = true;
    this.createFormLoadingText = '提交中...';

    // 保存到数据库
    const newFormInfo = {
      id: this.formData.length + 1,
      guid: uuidv4(),
      name: this.createFormGroup.value.name.toString().trim(),
      description: this.createFormGroup.value.description.toString().trim(),
    };
    this.subscriptions.push(
      this.systemManagerService.addForm(newFormInfo).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ add: [newFormInfo] });
          this.createFormLoading = false;
          this.createFormGroup.controls['name'].setValue('');
          this.createFormGroup.controls['description'].setValue('');
          modelRef.close();
          // 提示
          this.toastr.success('新表单添加成功!');
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

  editForm(rowNode: any) {
    this.editFormGroup.controls['name'].setValue(rowNode.data.name);
    this.editFormGroup.controls['description'].setValue(rowNode.data.description);

    this.editRowNode = rowNode;
    // 设置初始值
    const modalReference = this.modalService.open(this.editFormContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
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
  editFormSave(modelRef: any) {
    // 首先判断名称不能为空，描述暂时不判断、可以为空
    const name: string = this.editFormGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.editFormNotification.nameMessageShow = true;
      this.editFormNotification.nameMessage = '请输入表单名称';
      return;
    }

    this.editFormLoading = true;
    this.editFormLoadingText = '提交中...';

    // 保存到数据库
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editFormGroup.value.name.toString().trim();
    rowNode.data.description = this.editFormGroup.value.description.toString().trim();
    this.subscriptions.push(
      this.systemManagerService.editForm(rowNode.data).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ update: [rowNode.data] });
          this.editFormLoading = false;
          this.editFormGroup.controls['name'].setValue('');
          this.editFormGroup.controls['description'].setValue('');

          modelRef.close();
          // 提示
          this.toastr.success('表单信息修改成功!');
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

  deleteForm(rowNode: any) {
    this.deleteRowNode = rowNode;
    const modalReference = this.modalService.open(this.deleteFormContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.deleteFormLoading = false;
      }
    );
  }

  deleteFormSave(modelRef: any) {
    this.deleteFormLoading = true;
    this.deleteFormLoadingText = '删除中...';

    const rowNode = this.deleteRowNode;
    // 保存到数据库
    this.subscriptions.push(
      this.systemManagerService.deleteForm(rowNode.data.guid).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ remove: [rowNode.data] });
          this.deleteFormLoading = false;
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
          this.toastr.success('表单信息删除成功!');
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
      this.systemManagerService.editForm(params.data).subscribe(
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
