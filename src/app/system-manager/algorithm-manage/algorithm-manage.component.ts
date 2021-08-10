import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { IGeoprocessingModel, INameDescriptionNotification } from '../../shared/interface/system-manager.interface';
import { SystemManagerService } from '../system-manager.service';
import { AlgorithmCrudOperationComponent } from './algorithm-crud-opeartion.component';

@Component({
  selector: 'app-algorithm-manage',
  templateUrl: './algorithm-manage.component.html',
  styleUrls: ['./algorithm-manage.component.scss'],
})
export class AlgorithmManageComponent implements OnDestroy {
  @ViewChild('createAlgorithmContent') createAlgorithmContent!: TemplateRef<void>;
  @ViewChild('editAlgorithmContent') editAlgorithmContent!: TemplateRef<void>;
  @ViewChild('deleteAlgorithmContent') deleteAlgorithmContent!: TemplateRef<void>;

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
      minWidth: 150,
      suppressMenu: true,
      sortable: true,
      unSortIcon: true,
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
      flex: 2,
      minWidth: 450,
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
      cellRenderer: 'algorithmCrudOperationComponent',
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

  /** */
  public algorithmData!: IGeoprocessingModel[];

  // 创建新算法
  public createAlgorithmNotification: INameDescriptionNotification;
  public createAlgorithmGroup: FormGroup;
  public createAlgorithmLoading: boolean = false;
  public createAlgorithmLoadingText: string = '';

  // 编辑算法信息
  public editAlgorithmNotification: INameDescriptionNotification;
  public editAlgorithmGroup: FormGroup;
  public editAlgorithmLoading: boolean = false;
  public editAlgorithmLoadingText: string = '';
  public editRowNode!: RowNode;

  // 删除算法
  public deleteAlgorithmLoading: boolean = false;
  public deleteAlgorithmLoadingText: string = '';
  public deleteRowNode!: RowNode;

  private subscriptions: Subscription[] = [];

  constructor(
    private systemManagerService: SystemManagerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    // 创建新算法
    this.createAlgorithmNotification = {
      nameMessageShow: false,
      nameMessage: '请输入算法名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入算法描述', // 算法描述暂时可以为空
    };

    this.createAlgorithmGroup = this.fb.group({
      name: [''],
      description: [''],
    });

    this.createAlgorithmGroup.controls['name'].valueChanges.subscribe((_value: string) => {
      this.createAlgorithmNotification.nameMessageShow = false;
    });

    this.createAlgorithmGroup.controls['description'].valueChanges.subscribe((_value: string) => {
      this.createAlgorithmNotification.descriptionMessageShow = false;
    });

    // 编辑算法信息
    this.editAlgorithmNotification = {
      nameMessageShow: false,
      nameMessage: '请输入算法名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入算法描述',
    };

    this.editAlgorithmGroup = this.fb.group({
      name: [''],
      description: [''],
    });

    this.editAlgorithmGroup.controls['name'].valueChanges.subscribe((_value: string) => {
      this.editAlgorithmNotification.nameMessageShow = false;
    });

    this.editAlgorithmGroup.controls['description'].valueChanges.subscribe((_value: string) => {
      this.editAlgorithmNotification.descriptionMessageShow = false;
    });

    // ag-grid
    this.frameworkComponents = {
      algorithmCrudOperationComponent: AlgorithmCrudOperationComponent,
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

    // /从服务中获取所有算法信息
    this.subscriptions.push(
      this.systemManagerService.getAllAlgorithms().subscribe(
        res => {
          this.algorithmData = res.algorithmData;
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
   * 创建新的算法信息,对话框模式
   *
   */
  createAlgorithm() {
    const modalReference = this.modalService.open(this.createAlgorithmContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.createAlgorithmLoading = false;
        this.createAlgorithmGroup.controls['name'].setValue('');
        this.createAlgorithmGroup.controls['description'].setValue('');
        Object.assign(this.createAlgorithmNotification, {
          nameMessageShow: false,
          nameMessage: '请输入算法名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入算法描述',
        });
      }
    );
  }
  createAlgorithmSave(modelRef: NgbModalRef) {
    // 首先判断名称不能为空，描述暂时不判断、可以为空
    const name: string = this.createAlgorithmGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.createAlgorithmNotification.nameMessageShow = true;
      this.createAlgorithmNotification.nameMessage = '请输入算法名称';
      return;
    }

    this.createAlgorithmLoading = true;
    this.createAlgorithmLoadingText = '提交中...';

    // 保存到数据库
    const newAlgorithmInfo = {
      id: this.algorithmData.length + 1,
      guid: uuidv4(),
      name: this.createAlgorithmGroup.value.name.toString().trim(),
      description: this.createAlgorithmGroup.value.description.toString().trim(),
    };
    this.subscriptions.push(
      this.systemManagerService.addAlgorithm(newAlgorithmInfo).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ add: [newAlgorithmInfo] });
          this.createAlgorithmLoading = false;
          this.createAlgorithmGroup.controls['name'].setValue('');
          this.createAlgorithmGroup.controls['description'].setValue('');
          modelRef.close();
          // 提示
          this.toastr.success('新算法添加成功!');
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

  editAlgorithm(rowNode: RowNode) {
    this.editAlgorithmGroup.controls['name'].setValue(rowNode.data.name);
    this.editAlgorithmGroup.controls['description'].setValue(rowNode.data.description);

    this.editRowNode = rowNode;
    // 设置初始值
    const modalReference = this.modalService.open(this.editAlgorithmContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.editAlgorithmLoading = false;
        this.editAlgorithmGroup.controls['name'].setValue('');
        this.editAlgorithmGroup.controls['description'].setValue('');
        Object.assign(this.editAlgorithmNotification, {
          nameMessageShow: false,
          nameMessage: '请输入算法名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入算法描述',
        });
      }
    );
  }
  editAlgorithmSave(modelRef: NgbModalRef) {
    // 首先判断名称不能为空，描述暂时不判断、可以为空
    const name: string = this.editAlgorithmGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.editAlgorithmNotification.nameMessageShow = true;
      this.editAlgorithmNotification.nameMessage = '请输入算法名称';
      return;
    }

    this.editAlgorithmLoading = true;
    this.editAlgorithmLoadingText = '提交中...';

    // 保存到数据库
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editAlgorithmGroup.value.name.toString().trim();
    rowNode.data.description = this.editAlgorithmGroup.value.description.toString().trim();
    this.subscriptions.push(
      this.systemManagerService.editAlgorithm(rowNode.data).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ update: [rowNode.data] });
          this.editAlgorithmLoading = false;
          this.editAlgorithmGroup.controls['name'].setValue('');
          this.editAlgorithmGroup.controls['description'].setValue('');

          modelRef.close();
          // 提示
          this.toastr.success('算法信息修改成功!');
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

  deleteAlgorithm(rowNode: RowNode) {
    this.deleteRowNode = rowNode;
    const modalReference = this.modalService.open(this.deleteAlgorithmContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.deleteAlgorithmLoading = false;
      }
    );
  }
  deleteAlgorithmSave(modelRef: NgbModalRef) {
    this.deleteAlgorithmLoading = true;
    this.deleteAlgorithmLoadingText = '删除中...';

    const rowNode = this.deleteRowNode;
    // 保存到数据库
    this.subscriptions.push(
      this.systemManagerService.deleteAlgorithm(rowNode.data.guid).subscribe(
        _res => {
          // 保存成功，添加到数组中
          this.gridApi.applyTransaction({ remove: [rowNode.data] });
          this.deleteAlgorithmLoading = false;
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
          this.toastr.success('算法模型删除成功!');
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
      this.systemManagerService.editAlgorithm(params.data).subscribe(
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
