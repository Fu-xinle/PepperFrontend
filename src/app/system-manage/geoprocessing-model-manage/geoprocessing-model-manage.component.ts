import { Component, OnDestroy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RowNode, GridApi, GridReadyEvent, GetQuickFilterTextParams, ILoadingOverlayComp, INoRowsOverlayComp } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { IGeoprocessingModel, IFormNotification } from '../../shared/interface/system-manage.interface';
import { GeoprocessingModelService } from '../service/geoprocessing-model.service';
import { GeoprocessingModelCrudOperationComponent } from './geoprocessing-model-crud-opeartion.component';

@Component({
  selector: 'app-geoprocessing-model-manage',
  templateUrl: './geoprocessing-model-manage.component.html',
  styleUrls: ['./geoprocessing-model-manage.component.scss'],
})
export class GeoprocessingModelManageComponent implements OnInit, OnDestroy {
  /**对话框模板引用,利用ngbModal创建对话框，编辑地理模型信息、删除地理模型 */
  @ViewChild('createGeoprocessingModelContent') createGeoprocessingModelContent!: TemplateRef<void>;
  @ViewChild('editGeoprocessingModelContent') editGeoprocessingModelContent!: TemplateRef<void>;
  @ViewChild('deleteGeoprocessingModelContent') deleteGeoprocessingModelContent!: TemplateRef<void>;

  /**Ag-Grid表格列配置信息 */
  public columnDefs = [
    {
      headerName: '描述',
      field: 'description',
      suppressMenu: true,
      flex: 2,
      minWidth: 450,
    },
    {
      headerName: '创建者',
      field: 'create_user',
      initialWidth: 250,
      sortable: false,
      suppressMenu: true,
    },
    {
      headerName: '创建时间',
      field: 'create_time',
      initialWidth: 300,
      sortable: false,
      suppressMenu: true,
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

  /**Ag-Grid表格,树结构数据显示 */
  public autoGroupColumnDef;
  public getDataPath;
  public groupDefaultExpanded;

  /**搜索框搜索关键字、Ag-Grid快速搜索关键字 */
  public keySearcchValue: string = '';
  public keySearcchValue$ = new Subject<string>();
  public quickFilterText: string = '';

  /**地理处理模型数据列表 */
  public geoprocessingModelData!: IGeoprocessingModel[];

  /**创建地理处理模型:表单组件、表单信息提示、保存信息提示 */
  public createGeoprocessingModelGroup: FormGroup;
  public createGeoprocessingModelNotification: IFormNotification;
  public createGeoprocessingModelLoading: boolean = false;
  public createGeoprocessingModelLoadingText: string = '';

  /**编辑地理处理模型:编辑的模型信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editGeoprocessingModelGroup: FormGroup;
  public editGeoprocessingModelNotification: IFormNotification;
  public editGeoprocessingModelLoading: boolean = false;
  public editGeoprocessingModelLoadingText: string = '';

  /**删除地理处理模型:删除的模型信息(表中一行)、保存信息提示 */
  public deleteRowNode!: RowNode;
  public deleteGeoprocessingModelLoading: boolean = false;
  public deleteGeoprocessingModelLoadingText: string = '';

  /** ztreeselect 配置项 */
  public rootNodeId = '99fb71e8-a794-47c2-a9c6-dc0a6e36248f';
  public selectType: 'NORMAL' | 'RADIO' | 'CHECK' = 'RADIO';
  public selectMultiple: true | false = false;
  public treeSetting: ISetting = {};
  public zNodes: any[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private geoprocessingModelService: GeoprocessingModelService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    /**Ag-Grid表格,树结构数据显示 */
    this.autoGroupColumnDef = {
      headerName: '名称',
      minWidth: 250,
      cellRendererParams: { suppressCount: false, innerRenderer: 'nameCellRenderer' },
      flex: 1,
      suppressMenu: true,
      sortable: true,
      unSortIcon: true,
      sort: 'asc',
      icons: {
        sortAscending: '<i class="icon-Up" style="font-weight: bold;"></i>',
        sortDescending: '<i class="icon-Down" style="font-weight: bold;"></i>',
        sortUnSort: '<i class="icon-Up--Down"></i>',
      },
      comparator: (valueA: string, valueB: string) => {
        return valueA.localeCompare(valueB, 'zh-CN');
      },
    };

    this.getDataPath = (data: any) => {
      return data.tree_name.split('~');
    };

    this.groupDefaultExpanded = 1;

    /**创建地理处理模型变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.createGeoprocessingModelNotification = {
      name: { message: '请输入地理处理摸型名称', show: false },
      isLeaf: { message: '请选择类别', show: false },
      category: { message: '请选择地理处理模型类别', show: false },
      description: { message: '请输入地理处理摸型描述', show: false },
    };

    this.createGeoprocessingModelGroup = this.fb.group({
      name: [''],
      isLeaf: [1],
      category: [[]],
      description: [''],
    });

    for (const key in this.createGeoprocessingModelGroup.controls) {
      if (this.createGeoprocessingModelGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.createGeoprocessingModelGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.createGeoprocessingModelNotification[key].show = false;
          })
        );
      }
    }

    /**编辑地理处理模型变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editGeoprocessingModelNotification = {
      name: { message: '请输入地理处理摸型名称', show: false },
      category: { message: '请选择地理处理模型类别', show: false },
      description: { message: '请输入地理处理摸型描述', show: false },
    };

    this.editGeoprocessingModelGroup = this.fb.group({
      name: [''],
      category: [[]],
      description: [''],
    });

    for (const key in this.editGeoprocessingModelGroup.controls) {
      if (this.editGeoprocessingModelGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.editGeoprocessingModelGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.editGeoprocessingModelNotification[key].show = false;
          })
        );
      }
    }

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
      this.geoprocessingModelService.getAllGeoprocessingModels().subscribe({
        next: res => {
          this.geoprocessingModelData = res.geoprocessingModelData;
          this.zNodes = [
            { id: this.rootNodeId, pId: '#', name: '地理处理模型', chkDisabled: false, open: true },
            ...res.geoprocessingModelData.map((item: any) => {
              return {
                id: item.guid,
                pId: item.parent_guid,
                name: item.name,
                chkDisabled: item.is_leaf,
                isParent: !item.is_leaf,
                open: !item.is_leaf,
              };
            }),
          ];
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

    // ztreeselect树的初始化配置
    this.treeSetting = {
      view: {
        dblClickExpand: false,
        showIcon: true,
      },
      data: {
        simpleData: {
          enable: true,
        },
      },
    };
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

  // 指定Row的id标识
  getRowNodeId(data: any) {
    return data.guid;
  }

  /**
   * 新建地理处理模型时,直接跳转到模型设计页面,用户设计模型然后保存、另存为
   */
  newGeoprocessingModel() {
    this.router.navigate(['../../system-manage/geoprocessing-model-design', { guid: '' }], { relativeTo: this.activatedRoute });
  }

  /**
   * 利用ngbModal弹出创建地理处理模型对话框
   *
   * @param {RowNode} rowNode 新建地理处理模型的表格的父行
   */
  createGeoprocessingModel(rowNode: RowNode | null) {
    this.createGeoprocessingModelGroup.controls['name'].setValue('');
    this.createGeoprocessingModelGroup.controls['description'].setValue('');
    this.createGeoprocessingModelGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode?.data?.guid));
    this.createGeoprocessingModelGroup.controls['isLeaf'].setValue(1);

    const modalReference = this.modalService.open(this.createGeoprocessingModelContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.createGeoprocessingModelLoading = false;

        Object.assign(this.createGeoprocessingModelNotification, {
          name: { message: '请输入地理处理摸型名称', show: false },
          isLeaf: { message: '请选择类别', show: false },
          category: { message: '请选择地理处理模型类别', show: false },
          description: { message: '请输入地理处理摸型描述', show: false },
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
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.createGeoprocessingModelGroup.value[item]) && this.createGeoprocessingModelGroup.value[item].length === 0) ||
          (!Array.isArray(this.createGeoprocessingModelGroup.value[item]) &&
            !this.createGeoprocessingModelGroup.value[item].toString().trim())
        ) {
          this.createGeoprocessingModelNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.createGeoprocessingModelLoading = true;
    this.createGeoprocessingModelLoadingText = '提交中...';

    /**保存到数据库 */
    const newGeoprocessingModelInfo: any = {
      id: this.geoprocessingModelData.length + 1,
      guid: uuidv4(),
      name: this.createGeoprocessingModelGroup.value.name.toString().trim(),
      description: this.createGeoprocessingModelGroup.value.description.toString().trim(),
      isLeaf: this.createGeoprocessingModelGroup.value.isLeaf === 1,
      parentGuid: this.createGeoprocessingModelGroup.value.category[0].id,
    };
    newGeoprocessingModelInfo['tree_name'] =
      newGeoprocessingModelInfo.parentGuid === this.rootNodeId
        ? newGeoprocessingModelInfo.name
        : `${this.gridApi.getRowNode(newGeoprocessingModelInfo.parentGuid)!.data['tree_name']}~${newGeoprocessingModelInfo.name}`;

    this.subscriptions.push(
      this.geoprocessingModelService.addGeoprocessingModel(newGeoprocessingModelInfo).subscribe({
        next: _res => {
          newGeoprocessingModelInfo['create_user'] = _res['create_user'];
          newGeoprocessingModelInfo['create_time'] = _res['create_time'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ add: [newGeoprocessingModelInfo] });

          // ztree-select 添加节点
          this.zNodes.push({
            id: newGeoprocessingModelInfo.guid,
            pId: newGeoprocessingModelInfo.parentGuid,
            name: newGeoprocessingModelInfo.name,
            chkDisabled: newGeoprocessingModelInfo.isLeaf,
            isParent: !newGeoprocessingModelInfo.isLeaf,
            open: !newGeoprocessingModelInfo.isLeaf,
          });

          this.createGeoprocessingModelLoading = false;

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
    // 对话框值填充
    this.editGeoprocessingModelGroup.controls['name'].setValue(rowNode.data.name);
    this.editGeoprocessingModelGroup.controls['description'].setValue(rowNode.data.description);
    this.editGeoprocessingModelGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode.data.parent_guid));

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editGeoprocessingModelContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editGeoprocessingModelLoading = false;
        Object.assign(this.editGeoprocessingModelNotification, {
          name: { message: '请输入地理处理摸型名称', show: false },
          category: { message: '请选择地理处理模型类别', show: false },
          description: { message: '请输入地理处理摸型描述', show: false },
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
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.editGeoprocessingModelGroup.value[item]) && this.editGeoprocessingModelGroup.value[item].length === 0) ||
          (!Array.isArray(this.editGeoprocessingModelGroup.value[item]) && !this.editGeoprocessingModelGroup.value[item].toString().trim())
        ) {
          this.editGeoprocessingModelNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.editGeoprocessingModelLoading = true;
    this.editGeoprocessingModelLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editGeoprocessingModelGroup.value.name.toString().trim();
    rowNode.data['parent_guid'] = this.editGeoprocessingModelGroup.value.category[0].id;
    rowNode.data.description = this.editGeoprocessingModelGroup.value.description.toString().trim();
    this.subscriptions.push(
      this.geoprocessingModelService.editGeoprocessingModel(rowNode.data).subscribe({
        next: _res => {
          rowNode.data['create_user'] = _res['create_user'];
          rowNode.data['create_time'] = _res['create_time'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          var rowsToUpdate = this.getRowsToUpdate(
            rowNode,
            rowNode.data['parent_guid'] === this.rootNodeId ? '' : this.gridApi.getRowNode(rowNode.data['parent_guid'])!.data['tree_name']
          );
          this.gridApi.applyTransaction({ update: rowsToUpdate });

          // ztree-select 对应的节点也更新
          this.zNodes.some(treeNode => {
            if (treeNode.id === rowNode.data.guid) {
              treeNode.name = rowNode.data.name;
              treeNode.pId = rowNode.data['parent_guid'];
              return true;
            }
            return false;
          });
          this.editGeoprocessingModelLoading = false;

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
    const rowNode = this.deleteRowNode;

    if (rowNode.childrenAfterGroup!.length > 0) {
      modelRef.close();
      this.toastr.error('地理处理摸型类别包含子项', '错误');
      return;
    }

    this.deleteGeoprocessingModelLoading = true;
    this.deleteGeoprocessingModelLoadingText = '删除中...';

    /**保存到数据库 */
    this.subscriptions.push(
      this.geoprocessingModelService.deleteGeoprocessingModel(rowNode.data.guid).subscribe({
        next: _res => {
          /**更新Ag-Grid(由于删除一行，ID序号需要修改)、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ remove: [rowNode.data] });

          // ztree删除对应的树节点
          this.zNodes.splice(
            this.zNodes.findIndex(treeNode => treeNode.id === rowNode.data.guid),
            1
          );

          this.deleteGeoprocessingModelLoading = false;
          modelRef.close();
          this.toastr.success('地理处理摸型删除成功!');
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
   * Ag-Grid初始化完成后回调函数
   *
   * @param {GridReadyEvent} params Paramater Ag-Grid对象
   */
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api!;
  }

  /**
   * 树形表格中类别列添加图标
   *
   * @returns {()=>{}} 表格单元格渲染函数
   */
  getNameCellRenderer() {
    /**
     *
     */
    function nameCellRenderer() {}
    nameCellRenderer.prototype.init = function (params: any) {
      var tempDiv = document.createElement('div');
      var value = params.value;
      var icon = params.data.is_leaf ? 'icon-File' : 'icon-Folder';
      tempDiv.innerHTML = icon
        ? `<span><i class="${icon} me-1 text-primary fw-bold"></i>` + `<span class="filename"></span>${value}</span>`
        : value;
      this.eGui = tempDiv.firstChild;
    };
    nameCellRenderer.prototype.getGui = function () {
      return this.eGui;
    };
    return nameCellRenderer;
  }

  /**
   * 表格中弹出的上下文菜单
   *
   * @param {any} params 上下文参数
   * @returns {[]} 上下文菜单
   */
  getContextMenuItems(params: any) {
    return [
      {
        name: '添加地理处理模型或者类别',
        action: () => {
          params.context.componentParent.createGeoprocessingModel(null);
        },
        icon: '<i class="icon-Add text-16"></i>',
      },
    ];
  }

  /**
   * 树形表格信息修改设计所属类别移动
   *
   * @param {RowNode} node 表格中修改的当前行
   * @param {string} parenTreeName 表格中父行的tree_name
   * @returns {any[]} 需要更新的行
   */
  private getRowsToUpdate(node: RowNode, parenTreeName: string) {
    var res: any[] = [];
    var newTreeName = parenTreeName ? `${parenTreeName}~${node.data['name']}` : node.data['name'];
    if (node.data) {
      node.data['tree_name'] = newTreeName;
    }
    for (var i = 0; i < node.childrenAfterGroup!.length; i++) {
      var updatedChildRowData = this.getRowsToUpdate(node.childrenAfterGroup![i], newTreeName);
      res = res.concat(updatedChildRowData);
    }
    return node.data ? res.concat([node.data]) : res;
  }
}
