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
import { IFlowModel, IFormNotification } from '../../shared/interface/system-manage.interface';
import { FlowManageService } from '../service/flow-manage.service';
import { FlowCrudOperationComponent } from './flow-crud-opeartion.component';

@Component({
  selector: 'app-flow-manage',
  templateUrl: './flow-manage.component.html',
  styleUrls: ['./flow-manage.component.scss'],
})
export class FlowManageComponent implements OnInit, OnDestroy {
  /**对话框模板引用,利用ngbModal创建对话框，创建流程、编辑流程信息、删除流程 */
  @ViewChild('createFlowContent') createFlowContent!: TemplateRef<void>;
  @ViewChild('editFlowContent') editFlowContent!: TemplateRef<void>;
  @ViewChild('deleteFlowContent') deleteFlowContent!: TemplateRef<void>;

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
      field: 'createUser',
      initialWidth: 250,
      sortable: false,
      suppressMenu: true,
    },
    {
      headerName: '创建时间',
      field: 'createTime',
      initialWidth: 300,
      sortable: false,
      suppressMenu: true,
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

  /**Ag-Grid表格,树结构数据显示 */
  public autoGroupColumnDef;
  public getDataPath;
  public groupDefaultExpanded;

  /**搜索框搜索关键字、Ag-Grid快速搜索关键字 */
  public keySearcchValue: string = '';
  public keySearcchValue$ = new Subject<string>();
  public quickFilterText: string = '';

  /**流程数据列表 */
  public flowData!: IFlowModel[];

  /**创建流程:表单组件、表单信息提示、保存信息提示 */
  public createFlowGroup: FormGroup;
  public createFlowNotification: IFormNotification;
  public createFlowLoading: boolean = false;
  public createFlowLoadingText: string = '';

  /**编辑流程:编辑的流程信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editFlowGroup: FormGroup;
  public editFlowNotification: IFormNotification;
  public editFlowLoading: boolean = false;
  public editFlowLoadingText: string = '';

  /**删除流程:删除的流程信息(表中一行)、保存信息提示 */
  public deleteRowNode!: RowNode;
  public deleteFlowLoading: boolean = false;
  public deleteFlowLoadingText: string = '';

  /** ztreeselect 配置项 */
  public rootNodeId = 'bc7dc16e-184f-4743-a9c5-e7d1507be350';
  public selectType: 'NORMAL' | 'RADIO' | 'CHECK' = 'RADIO';
  public selectMultiple: true | false = false;
  public treeSetting: ISetting = {};
  public zNodes: any[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flowManageService: FlowManageService,
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
      return data.treeName.split('~');
    };

    this.groupDefaultExpanded = 1;

    /**创建流程变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.createFlowNotification = {
      name: { message: '请输入流程名称', show: false },
      isLeaf: { message: '请选择类别', show: false },
      category: { message: '请选择流程类别', show: false },
      description: { message: '请输入流程描述', show: false },
    };

    this.createFlowGroup = this.fb.group({
      name: [''],
      isLeaf: [1],
      category: [[]],
      description: [''],
    });

    for (const key in this.createFlowGroup.controls) {
      if (this.createFlowGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.createFlowGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.createFlowNotification[key].show = false;
          })
        );
      }
    }

    /**编辑流程变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editFlowNotification = {
      name: { message: '请输入流程名称', show: false },
      category: { message: '请选择流程类别', show: false },
      description: { message: '请输入流程描述', show: false },
    };

    this.editFlowGroup = this.fb.group({
      name: [''],
      category: [[]],
      description: [''],
    });

    for (const key in this.editFlowGroup.controls) {
      if (this.editFlowGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.editFlowGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.editFlowNotification[key].show = false;
          })
        );
      }
    }

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
          this.zNodes = [
            { id: this.rootNodeId, pId: '#', name: '流程', chkDisabled: false, open: true, isParent: true },
            ...res.flowData.map((item: any) => {
              return {
                id: item.guid,
                pId: item.parentGuid,
                name: item.name,
                chkDisabled: item.isLeaf,
                isParent: !item.isLeaf,
                open: !item.isLeaf,
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
   * 创建流程转到流程设计页面
   */
  public newFlow() {
    this.router.navigate(['../../system-manage/flow-design', { guid: '' }], { relativeTo: this.activatedRoute });
  }

  /**
   * 利用ngbModal弹出创建流程对话框
   *
   * @param {RowNode} rowNode 新建流程的表格的父行
   */
  createFlow(rowNode: RowNode | null) {
    this.createFlowGroup.controls['name'].setValue('');
    this.createFlowGroup.controls['description'].setValue('');
    this.createFlowGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode?.data?.guid));
    this.createFlowGroup.controls['isLeaf'].setValue(1);

    const modalReference = this.modalService.open(this.createFlowContent, { centered: true, backdrop: 'static' });

    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.createFlowLoading = false;

        Object.assign(this.createFlowNotification, {
          name: { message: '请输入流程名称', show: false },
          isLeaf: { message: '请选择类别', show: false },
          category: { message: '请选择流程类别', show: false },
          description: { message: '请输入流程描述', show: false },
        });
      }
    );
  }

  /**
   * 创建流程对话框,单击保存事件，将新创建流程保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  createFlowSave(modelRef: NgbModalRef) {
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.createFlowGroup.value[item]) && this.createFlowGroup.value[item].length === 0) ||
          (!Array.isArray(this.createFlowGroup.value[item]) && !this.createFlowGroup.value[item].toString().trim())
        ) {
          this.createFlowNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.createFlowLoading = true;
    this.createFlowLoadingText = '提交中...';

    /**保存到数据库 */
    const newFlowInfo: any = {
      id: this.flowData.length + 1,
      guid: uuidv4(),
      name: this.createFlowGroup.value.name.toString().trim(),
      description: this.createFlowGroup.value.description.toString().trim(),
      isLeaf: this.createFlowGroup.value.isLeaf === 1,
      parentGuid: this.createFlowGroup.value.category[0].id,
    };

    newFlowInfo['treeName'] =
      newFlowInfo.parentGuid === this.rootNodeId
        ? newFlowInfo.name
        : `${this.gridApi.getRowNode(newFlowInfo.parentGuid)!.data['treeName']}~${newFlowInfo.name}`;

    this.subscriptions.push(
      this.flowManageService.addFlow(newFlowInfo).subscribe({
        next: _res => {
          newFlowInfo['createUser'] = _res['createUser'];
          newFlowInfo['createTime'] = _res['createTime'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ add: [newFlowInfo] });

          // ztree-select 添加节点
          this.zNodes.push({
            id: newFlowInfo.guid,
            pId: newFlowInfo.parentGuid,
            name: newFlowInfo.name,
            chkDisabled: newFlowInfo.isLeaf,
            isParent: !newFlowInfo.isLeaf,
            open: !newFlowInfo.isLeaf,
          });

          this.createFlowLoading = false;

          modelRef.close();
          this.toastr.success('新流程添加成功!');
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
   * 利用ngbModal弹出编辑流程信息对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即编辑的流程信息
   */
  editFlow(rowNode: RowNode) {
    // 对话框值填充
    this.editFlowGroup.controls['name'].setValue(rowNode.data.name);
    this.editFlowGroup.controls['description'].setValue(rowNode.data.description);
    this.editFlowGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode.data.parentGuid));

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editFlowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editFlowLoading = false;

        Object.assign(this.editFlowNotification, {
          name: { message: '请输入流程名称', show: false },
          category: { message: '请选择流程类别', show: false },
          description: { message: '请输入流程描述', show: false },
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
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.editFlowGroup.value[item]) && this.editFlowGroup.value[item].length === 0) ||
          (!Array.isArray(this.editFlowGroup.value[item]) && !this.editFlowGroup.value[item].toString().trim())
        ) {
          this.editFlowNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.editFlowLoading = true;
    this.editFlowLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editFlowGroup.value.name.toString().trim();
    rowNode.data['parentGuid'] = this.editFlowGroup.value.category[0].id;
    rowNode.data.description = this.editFlowGroup.value.description.toString().trim();
    this.subscriptions.push(
      this.flowManageService.editFlow(rowNode.data).subscribe({
        next: _res => {
          rowNode.data['createUser'] = _res['createUser'];
          rowNode.data['createTime'] = _res['createTime'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          var rowsToUpdate = this.getRowsToUpdate(
            rowNode,
            rowNode.data['parentGuid'] === this.rootNodeId ? '' : this.gridApi.getRowNode(rowNode.data['parentGuid'])!.data['treeName']
          );
          this.gridApi.applyTransaction({ update: rowsToUpdate });

          // ztree-select 对应的节点也更新
          this.zNodes.some(treeNode => {
            if (treeNode.id === rowNode.data.guid) {
              treeNode.name = rowNode.data.name;
              treeNode.pId = rowNode.data['parentGuid'];
              return true;
            }
            return false;
          });
          this.editFlowLoading = false;

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
    const rowNode = this.deleteRowNode;

    if (rowNode.childrenAfterGroup!.length > 0) {
      modelRef.close();
      this.toastr.error('流程类别包含子项', '错误');
      return;
    }

    this.deleteFlowLoading = true;
    this.deleteFlowLoadingText = '删除中...';

    /**保存到数据库 */
    this.subscriptions.push(
      this.flowManageService.deleteFlow(rowNode.data.guid).subscribe({
        next: _res => {
          /**更新Ag-Grid(由于删除一行，ID序号需要修改)、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ remove: [rowNode.data] });

          // ztree删除对应的树节点
          this.zNodes.splice(
            this.zNodes.findIndex(treeNode => treeNode.id === rowNode.data.guid),
            1
          );

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
      var icon = params.data.isLeaf ? 'icon-File' : 'icon-Folder';
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
        name: '添加流程或者类别',
        action: () => {
          params.context.componentParent.createFlow(null);
        },
        icon: '<i class="icon-Add text-16"></i>',
      },
    ];
  }

  /**
   * 树形表格信息修改设计所属类别移动
   *
   * @param {RowNode} node 表格中修改的当前行
   * @param {string} parenTreeName 表格中父行的treeName
   * @returns {any[]} 需要更新的行
   */
  private getRowsToUpdate(node: RowNode, parenTreeName: string) {
    var res: any[] = [];
    var newTreeName = parenTreeName ? `${parenTreeName}~${node.data['name']}` : node.data['name'];
    if (node.data) {
      node.data['treeName'] = newTreeName;
    }
    for (var i = 0; i < node.childrenAfterGroup!.length; i++) {
      var updatedChildRowData = this.getRowsToUpdate(node.childrenAfterGroup![i], newTreeName);
      res = res.concat(updatedChildRowData);
    }
    return node.data ? res.concat([node.data]) : res;
  }
}
