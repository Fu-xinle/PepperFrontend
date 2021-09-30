import { Component, OnDestroy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

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
import { v4 as uuidv4 } from 'uuid';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { IGeoprocessingModel, INameDescriptionNotification } from '../../shared/interface/system-manage.interface';
import { SystemManageService } from '../system-manage.service';
import { GeoprocessingModelCrudOperationComponent } from './geoprocessing-model-crud-opeartion.component';

@Component({
  selector: 'app-geoprocessing-model-manage',
  templateUrl: './geoprocessing-model-manage.component.html',
  styleUrls: ['./geoprocessing-model-manage.component.scss'],
})
export class GeoprocessingModelManageComponent implements OnInit, OnDestroy {
  /**对话框模板引用,利用ngbModal创建对话框，创建地理模型、编辑地理模型信息、删除地理模型 */
  @ViewChild('createGeoprocessingModelContent') createGeoprocessingModelContent!: TemplateRef<void>;
  @ViewChild('editGeoprocessingModelContent') editGeoprocessingModelContent!: TemplateRef<void>;
  @ViewChild('deleteGeoprocessingModelContent') deleteGeoprocessingModelContent!: TemplateRef<void>;

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
      cellRenderer: 'geoprocessingModelCrudOperationComponent',
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

  /**地理处理模型数据列表 */
  public geoprocessingModelData!: IGeoprocessingModel[];

  /**创建地理处理模型:表单组件、表单信息提示、保存信息提示 */
  public createGeoprocessingModelGroup: FormGroup;
  public createGeoprocessingModelNotification: INameDescriptionNotification;
  public createGeoprocessingModelLoading: boolean = false;
  public createGeoprocessingModelLoadingText: string = '';

  /**编辑地理处理模型:编辑的模型信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editGeoprocessingModelGroup: FormGroup;
  public editGeoprocessingModelNotification: INameDescriptionNotification;
  public editGeoprocessingModelLoading: boolean = false;
  public editGeoprocessingModelLoadingText: string = '';

  /**删除地理处理模型:删除的模型信息(表中一行)、保存信息提示 */
  public deleteRowNode!: RowNode;
  public deleteGeoprocessingModelLoading: boolean = false;
  public deleteGeoprocessingModelLoadingText: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private systemManageService: SystemManageService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    /**创建地理处理模型变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.createGeoprocessingModelNotification = {
      nameMessageShow: false,
      nameMessage: '请输入地理处理摸型名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入地理处理摸型描述',
    };

    this.createGeoprocessingModelGroup = this.fb.group({
      name: [''],
      description: [''],
    });

    this.subscriptions.push(
      this.createGeoprocessingModelGroup.controls['name'].valueChanges.subscribe((_value: string) => {
        this.createGeoprocessingModelNotification.nameMessageShow = false;
      })
    );

    this.subscriptions.push(
      this.createGeoprocessingModelGroup.controls['description'].valueChanges.subscribe((_value: string) => {
        this.createGeoprocessingModelNotification.descriptionMessageShow = false;
      })
    );

    /**编辑地理处理模型变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editGeoprocessingModelNotification = {
      nameMessageShow: false,
      nameMessage: '请输入地理处理摸型名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入地理处理摸型描述',
    };

    this.editGeoprocessingModelGroup = this.fb.group({
      name: [''],
      description: [''],
    });

    this.subscriptions.push(
      this.editGeoprocessingModelGroup.controls['name'].valueChanges.subscribe((_value: string) => {
        this.editGeoprocessingModelNotification.nameMessageShow = false;
      })
    );

    this.subscriptions.push(
      this.editGeoprocessingModelGroup.controls['description'].valueChanges.subscribe((_value: string) => {
        this.editGeoprocessingModelNotification.descriptionMessageShow = false;
      })
    );

    /**Ag-Grid表格的加载显示和空数据显示,自定义重载*/
    this.frameworkComponents = {
      geoprocessingModelCrudOperationComponent: GeoprocessingModelCrudOperationComponent,
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

    /**从服务器获取已有地理处理模型，显示在Ag-Grid表格中 */
    this.subscriptions.push(
      this.systemManageService.getAllGeoprocessingModels().subscribe({
        next: res => {
          this.geoprocessingModelData = res.geoprocessingModelData;
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
   * 利用ngbModal弹出创建地理处理模型对话框
   */
  createGeoprocessingModel() {
    const modalReference = this.modalService.open(this.createGeoprocessingModelContent, { centered: true, backdrop: 'static' });

    modalReference.result.then(
      _result => {},
      _reason => {
        this.createGeoprocessingModelLoading = false;
        this.createGeoprocessingModelGroup.controls['name'].setValue('');
        this.createGeoprocessingModelGroup.controls['description'].setValue('');
        Object.assign(this.createGeoprocessingModelNotification, {
          nameMessageShow: false,
          nameMessage: '请输入地理处理摸型名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入地理处理摸型描述',
        });
      }
    );
  }

  /**
   * 创建地理处理模型对话框,单击保存事件，将新创建地理处理模型保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  createGeoprocessingModelSave(modelRef: NgbModalRef) {
    /**判断名称不能为空，描述暂时不判断、可以为空 */
    const name: string = this.createGeoprocessingModelGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.createGeoprocessingModelNotification.nameMessageShow = true;
      this.createGeoprocessingModelNotification.nameMessage = '请输入地理处理摸型名称';
      return;
    }

    this.createGeoprocessingModelLoading = true;
    this.createGeoprocessingModelLoadingText = '提交中...';

    /**保存到数据库 */
    const newGeoprocessingModelInfo = {
      id: this.geoprocessingModelData.length + 1,
      guid: uuidv4(),
      name: this.createGeoprocessingModelGroup.value.name.toString().trim(),
      description: this.createGeoprocessingModelGroup.value.description.toString().trim(),
    };
    this.subscriptions.push(
      this.systemManageService.addGeoprocessingModel(newGeoprocessingModelInfo).subscribe({
        next: _res => {
          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ add: [newGeoprocessingModelInfo] });

          this.createGeoprocessingModelLoading = false;
          this.createGeoprocessingModelGroup.controls['name'].setValue('');
          this.createGeoprocessingModelGroup.controls['description'].setValue('');

          modelRef.close();
          this.toastr.success('新地理处理摸型添加成功!');
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
   * 利用ngbModal弹出编辑地理处理模型对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即编辑的地理处理模型信息
   */
  editGeoprocessingModel(rowNode: RowNode) {
    this.editGeoprocessingModelGroup.controls['name'].setValue(rowNode.data.name);
    this.editGeoprocessingModelGroup.controls['description'].setValue(rowNode.data.description);

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editGeoprocessingModelContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editGeoprocessingModelLoading = false;
        this.editGeoprocessingModelGroup.controls['name'].setValue('');
        this.editGeoprocessingModelGroup.controls['description'].setValue('');
        Object.assign(this.editGeoprocessingModelNotification, {
          nameMessageShow: false,
          nameMessage: '请输入地理处理摸型名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入地理处理摸型描述',
        });
      }
    );
  }

  /**
   * 编辑地理处理模型对话框,单击保存事件，将修改保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  editGeoprocessingModelSave(modelRef: NgbModalRef) {
    /**判断名称不能为空，描述暂时不判断、可以为空 */
    const name: string = this.editGeoprocessingModelGroup.value.name.toString().trim();
    if (name.length === 0) {
      this.editGeoprocessingModelNotification.nameMessageShow = true;
      this.editGeoprocessingModelNotification.nameMessage = '请输入地理处理摸型名称';
      return;
    }

    this.editGeoprocessingModelLoading = true;
    this.editGeoprocessingModelLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editGeoprocessingModelGroup.value.name.toString().trim();
    rowNode.data.description = this.editGeoprocessingModelGroup.value.description.toString().trim();
    this.subscriptions.push(
      this.systemManageService.editGeoprocessingModel(rowNode.data).subscribe({
        next: _res => {
          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ update: [rowNode.data] });

          this.editGeoprocessingModelLoading = false;
          this.editGeoprocessingModelGroup.controls['name'].setValue('');
          this.editGeoprocessingModelGroup.controls['description'].setValue('');

          modelRef.close();
          this.toastr.success('地理处理摸型信息修改成功!');
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
   * 利用ngbModal弹出删除地理处理模型对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即删除的地理处理模型信息
   */
  deleteGeoprocessingModel(rowNode: RowNode) {
    this.deleteRowNode = rowNode;

    const modalReference = this.modalService.open(this.deleteGeoprocessingModelContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.deleteGeoprocessingModelLoading = false;
      }
    );
  }

  /**
   * 删除地理处理模型对话框,单击保存事件，从数据库中删除地理处理模型
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  deleteGeoprocessingModelSave(modelRef: NgbModalRef) {
    this.deleteGeoprocessingModelLoading = true;
    this.deleteGeoprocessingModelLoadingText = '删除中...';

    const rowNode = this.deleteRowNode;

    /**保存到数据库 */
    this.subscriptions.push(
      this.systemManageService.deleteGeoprocessingModel(rowNode.data.guid).subscribe({
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

          this.deleteGeoprocessingModelLoading = false;
          modelRef.close();
          this.toastr.success('地理处理摸型模型删除成功!');
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
      this.systemManageService.editGeoprocessingModel(params.data).subscribe({
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
