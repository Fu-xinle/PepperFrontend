import { Component, OnDestroy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RowNode, GridApi, GridReadyEvent, GetQuickFilterTextParams, ILoadingOverlayComp, INoRowsOverlayComp } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppLoadingOverlayComponent } from '../../shared/components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from '../../shared/components/ag-grid/app-no-rows-overlay.component';
import { IWorkflowModel, IFormNotification } from '../../shared/interface/system-manage.interface';
import { FlowManageService } from '../service/flow-manage.service';
import { FormManageService } from '../service/form-manage.service';
import { WorkflowManageService } from '../service/workflow-manage.service';
import { WorkflowCrudOperationComponent } from './workflow-crud-opeartion.component';

@Component({
  selector: 'app-workflow-manage',
  templateUrl: './workflow-manage.component.html',
  styleUrls: ['./workflow-manage.component.scss'],
})
export class WorkflowManageComponent implements OnInit, OnDestroy {
  /**对话框模板引用,利用ngbModal创建对话框，编辑业务工作流信息、删除业务工作流 */
  @ViewChild('createWorkflowContent') createWorkflowContent!: TemplateRef<void>;
  @ViewChild('editWorkflowContent') editWorkflowContent!: TemplateRef<void>;
  @ViewChild('deleteWorkflowContent') deleteWorkflowContent!: TemplateRef<void>;

  /**Ag-Grid表格列配置信息 */
  public columnDefs = [
    {
      headerName: '描述',
      field: 'description',
      suppressMenu: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: '关联的流程',
      field: 'flowName',
      suppressMenu: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: '关联的表单',
      field: 'formName',
      suppressMenu: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: '创建者',
      field: 'createUser',
      initialWidth: 150,
      sortable: false,
      suppressMenu: true,
    },
    {
      headerName: '创建时间',
      field: 'createTime',
      initialWidth: 150,
      sortable: false,
      suppressMenu: true,
    },
    {
      headerName: '',
      suppressMenu: true,
      field: 'guid',
      initialWidth: 180,
      cellRenderer: 'workflowCrudOperationComponent',
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

  /**业务工作流数据列表 */
  public workflowData!: IWorkflowModel[];

  /**创建业务工作流:表单组件、表单信息提示、保存信息提示 */
  public createWorkflowGroup: FormGroup;
  public createWorkflowNotification: IFormNotification;
  public createWorkflowLoading: boolean = false;
  public createWorkflowLoadingText: string = '';

  /**编辑业务工作流:编辑的业务工作流信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editWorkflowGroup: FormGroup;
  public editWorkflowNotification: IFormNotification;
  public editWorkflowLoading: boolean = false;
  public editWorkflowLoadingText: string = '';

  /**删除业务工作流:删除的业务工作流信息(表中一行)、保存信息提示 */
  public deleteRowNode!: RowNode;
  public deleteWorkflowLoading: boolean = false;
  public deleteWorkflowLoadingText: string = '';

  /** ztreeselect 配置项 */
  public workflowRootNodeId = '03bb1ba4-0aeb-46d7-a99c-f03bcc6ea0d5';
  public flowRootNodeId = 'bc7dc16e-184f-4743-a9c5-e7d1507be350';
  public formRootNodeId = 'e6e9ce2a-e960-4349-b5c0-866cb41d3037';
  public selectType: 'NORMAL' | 'RADIO' | 'CHECK' = 'RADIO';
  public selectMultiple: true | false = false;
  public treeWorkflowSetting: ISetting = {};
  public zWorkflowNodes: any[] = [];
  /** 关联的表单以及关联的流程的树节点数据 */
  public zFlowNodes: any[] = [];
  public treeFlowSetting: ISetting = {};
  public zFormNodes: any[] = [];
  public treeFormSetting: ISetting = {};

  private subscriptions: Subscription[] = [];

  constructor(
    private workflowManageService: WorkflowManageService,
    private flowManageService: FlowManageService,
    private formManageService: FormManageService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    /**Ag-Grid表格,树结构数据显示 */
    this.autoGroupColumnDef = {
      headerName: '名称',
      minWidth: 150,
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

    /**创建业务工作流变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.createWorkflowNotification = {
      name: { message: '请输入业务工作流名称', show: false },
      isLeaf: { message: '请选择类别', show: false },
      category: { message: '请选择业务工作流类别', show: false },
      description: { message: '请输入业务工作流描述', show: false },
      flow: { message: '请选择业务工作流关联的流程', show: false },
      form: { message: '请选择业务工作流关联的表单', show: false },
    };

    this.createWorkflowGroup = this.fb.group({
      name: [''],
      isLeaf: [1],
      category: [[]],
      description: [''],
      flow: [[]],
      form: [[]],
    });

    for (const key in this.createWorkflowGroup.controls) {
      if (this.createWorkflowGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.createWorkflowGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.createWorkflowNotification[key].show = false;
          })
        );
      }
    }

    /**编辑业务工作流变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editWorkflowNotification = {
      name: { message: '请输入业务工作流名称', show: false },
      category: { message: '请选择业务工作流类别', show: false },
      description: { message: '请输入业务工作流描述', show: false },
      flow: { message: '请选择业务工作流关联的流程', show: false },
      form: { message: '请选择业务工作流关联的表单', show: false },
    };

    this.editWorkflowGroup = this.fb.group({
      name: [''],
      category: [[]],
      description: [''],
      flow: [[]],
      form: [[]],
    });

    for (const key in this.editWorkflowGroup.controls) {
      if (this.editWorkflowGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.editWorkflowGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.editWorkflowNotification[key].show = false;
          })
        );
      }
    }

    /**Ag-Grid表格的加载显示和空数据显示,自定义重载*/
    this.frameworkComponents = {
      workflowCrudOperationComponent: WorkflowCrudOperationComponent,
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

    /**从服务器获取已有业务工作流、表单、流程，显示在Ag-Grid表格中 */
    this.subscriptions.push(
      forkJoin({
        workflow: this.workflowManageService.getAllWorkflows(),
        flow: this.flowManageService.getAllFlows(),
        form: this.formManageService.getAllForms(),
      }).subscribe({
        next: res => {
          this.workflowData = res.workflow.workflowData;
          this.zWorkflowNodes = [
            { id: this.workflowRootNodeId, pId: '#', name: '业务工作流', chkDisabled: false, open: true, isParent: true },
            ...res.workflow.workflowData.map((item: any) => {
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

          this.zFlowNodes = [
            { id: this.flowRootNodeId, pId: '#', name: '流程', chkDisabled: true, open: true, isParent: true },
            ...res.flow.flowData.map((item: any) => {
              return {
                id: item.guid,
                pId: item.parentGuid,
                name: item.name,
                chkDisabled: !item.isLeaf,
                isParent: !item.isLeaf,
                open: !item.isLeaf,
              };
            }),
          ];

          this.zFormNodes = [
            { id: this.formRootNodeId, pId: '#', name: '表单', chkDisabled: true, open: true, isParent: true },
            ...res.form.formData.map((item: any) => {
              return {
                id: item.guid,
                pId: item.parentGuid,
                name: item.name,
                chkDisabled: !item.isLeaf,
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
    this.treeWorkflowSetting = {
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
    this.treeFlowSetting = JSON.parse(JSON.stringify(this.treeWorkflowSetting));
    this.treeFormSetting = JSON.parse(JSON.stringify(this.treeWorkflowSetting));
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
   * 利用ngbModal弹出创建业务工作流对话框
   *
   * @param {RowNode} rowNode 新建业务工作流的表格的父行
   */
  createWorkflow(rowNode: RowNode | null) {
    this.createWorkflowGroup.controls['name'].setValue('');
    this.createWorkflowGroup.controls['description'].setValue('');
    this.createWorkflowGroup.controls['category'].setValue(this.zWorkflowNodes.filter(item => item.id === rowNode?.data?.guid));
    this.createWorkflowGroup.controls['flow'].setValue(this.zFlowNodes.filter(item => item.id === rowNode?.data?.flowGuid));
    this.createWorkflowGroup.controls['form'].setValue(this.zFormNodes.filter(item => item.id === rowNode?.data?.formGuid));
    this.createWorkflowGroup.controls['isLeaf'].setValue(1);

    const modalReference = this.modalService.open(this.createWorkflowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.createWorkflowLoading = false;

        Object.assign(this.createWorkflowNotification, {
          name: { message: '请输入业务工作流名称', show: false },
          isLeaf: { message: '请选择类别', show: false },
          category: { message: '请选择业务工作流类别', show: false },
          description: { message: '请输入业务工作流描述', show: false },
          flow: { message: '请选择业务工作流关联的流程', show: false },
          form: { message: '请选择业务工作流关联的表单', show: false },
        });
      }
    );
  }

  /**
   * 创建业务工作流对话框,单击保存事件，将新创建业务工作流保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  createWorkflowSave(modelRef: NgbModalRef) {
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.createWorkflowGroup.value[item]) && this.createWorkflowGroup.value[item].length === 0) ||
          (!Array.isArray(this.createWorkflowGroup.value[item]) && !this.createWorkflowGroup.value[item].toString().trim())
        ) {
          this.createWorkflowNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.createWorkflowLoading = true;
    this.createWorkflowLoadingText = '提交中...';

    /**保存到数据库 */
    const newWorkflowInfo: any = {
      id: this.workflowData.length + 1,
      guid: uuidv4(),
      name: this.createWorkflowGroup.value.name.toString().trim(),
      description: this.createWorkflowGroup.value.description.toString().trim(),
      isLeaf: this.createWorkflowGroup.value.isLeaf === 1,
      parentGuid: this.createWorkflowGroup.value.category[0].id,
      flowGuid: this.createWorkflowGroup.value.flow[0]?.id,
      formGuid: this.createWorkflowGroup.value.form[0]?.id,
      flowName: this.createWorkflowGroup.value.flow[0]?.name,
      formName: this.createWorkflowGroup.value.form[0]?.name,
    };
    newWorkflowInfo['treeName'] =
      newWorkflowInfo.parentGuid === this.workflowRootNodeId
        ? newWorkflowInfo.name
        : `${this.gridApi.getRowNode(newWorkflowInfo.parentGuid)!.data['treeName']}~${newWorkflowInfo.name}`;

    this.subscriptions.push(
      this.workflowManageService.addWorkflow(newWorkflowInfo).subscribe({
        next: _res => {
          newWorkflowInfo['createUser'] = _res['createUser'];
          newWorkflowInfo['createTime'] = _res['createTime'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ add: [newWorkflowInfo] });

          // ztree-select 添加节点
          this.zWorkflowNodes.push({
            id: newWorkflowInfo.guid,
            pId: newWorkflowInfo.parentGuid,
            name: newWorkflowInfo.name,
            chkDisabled: newWorkflowInfo.isLeaf,
            isParent: !newWorkflowInfo.isLeaf,
            open: !newWorkflowInfo.isLeaf,
          });

          this.createWorkflowLoading = false;

          modelRef.close();
          this.toastr.success('业务工作流添加成功!');
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
   * 利用ngbModal弹出编辑业务工作流对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即编辑的业务工作流信息
   */
  editWorkflow(rowNode: RowNode) {
    // 对话框值填充
    this.editWorkflowGroup.controls['name'].setValue(rowNode.data.name);
    this.editWorkflowGroup.controls['description'].setValue(rowNode.data.description);
    this.editWorkflowGroup.controls['category'].setValue(this.zWorkflowNodes.filter(item => item.id === rowNode.data.parentGuid));
    this.editWorkflowGroup.controls['flow'].setValue(this.zFlowNodes.filter(item => item.id === rowNode?.data?.flowGuid));
    this.editWorkflowGroup.controls['form'].setValue(this.zFormNodes.filter(item => item.id === rowNode?.data?.formGuid));

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editWorkflowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editWorkflowLoading = false;
        Object.assign(this.editWorkflowNotification, {
          name: { message: '请输入业务工作流名称', show: false },
          category: { message: '请选择业务工作流类别', show: false },
          description: { message: '请输入业务工作流描述', show: false },
          flow: { message: '请选择业务工作流关联的流程', show: false },
          form: { message: '请选择业务工作流关联的表单', show: false },
        });
      }
    );
  }

  /**
   * 编辑业务工作流对话框,单击保存事件，将修改保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  editWorkflowSave(modelRef: NgbModalRef) {
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.editWorkflowGroup.value[item]) && this.editWorkflowGroup.value[item].length === 0) ||
          (!Array.isArray(this.editWorkflowGroup.value[item]) && !this.editWorkflowGroup.value[item].toString().trim())
        ) {
          this.editWorkflowNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.editWorkflowLoading = true;
    this.editWorkflowLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editWorkflowGroup.value.name.toString().trim();
    rowNode.data['parentGuid'] = this.editWorkflowGroup.value.category[0].id;
    rowNode.data['flowGuid'] = this.editWorkflowGroup.value.flow[0]?.id;
    rowNode.data['flowName'] = this.editWorkflowGroup.value.flow[0]?.name;
    rowNode.data['formGuid'] = this.editWorkflowGroup.value.form[0]?.id;
    rowNode.data['formName'] = this.editWorkflowGroup.value.form[0]?.name;
    rowNode.data.description = this.editWorkflowGroup.value.description.toString().trim();

    this.subscriptions.push(
      this.workflowManageService.editWorkflow(rowNode.data).subscribe({
        next: _res => {
          rowNode.data['createUser'] = _res['createUser'];
          rowNode.data['createTime'] = _res['createTime'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          var rowsToUpdate = this.getRowsToUpdate(
            rowNode,
            rowNode.data['parentGuid'] === this.workflowRootNodeId
              ? ''
              : this.gridApi.getRowNode(rowNode.data['parentGuid'])!.data['treeName']
          );
          this.gridApi.applyTransaction({ update: rowsToUpdate });

          // ztree-select 对应的节点也更新
          this.zWorkflowNodes.some(treeNode => {
            if (treeNode.id === rowNode.data.guid) {
              treeNode.name = rowNode.data.name;
              treeNode.pId = rowNode.data['parentGuid'];
              return true;
            }
            return false;
          });
          this.editWorkflowLoading = false;

          modelRef.close();
          this.toastr.success('业务工作流信息修改成功!');
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
   * 利用ngbModal弹出删除业务工作流对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即删除的业务工作流信息
   */
  deleteWorkflow(rowNode: RowNode) {
    this.deleteRowNode = rowNode;

    const modalReference = this.modalService.open(this.deleteWorkflowContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.deleteWorkflowLoading = false;
      }
    );
  }

  /**
   * 删除业务工作流对话框,单击保存事件，从数据库中删除业务工作流
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  deleteWorkflowSave(modelRef: NgbModalRef) {
    const rowNode = this.deleteRowNode;

    if (rowNode.childrenAfterGroup!.length > 0) {
      modelRef.close();
      this.toastr.error('业务工作流类别包含子项', '错误');
      return;
    }

    this.deleteWorkflowLoading = true;
    this.deleteWorkflowLoadingText = '删除中...';

    /**保存到数据库 */
    this.subscriptions.push(
      this.workflowManageService.deleteWorkflow(rowNode.data.guid).subscribe({
        next: _res => {
          /**更新Ag-Grid(由于删除一行，ID序号需要修改)、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ remove: [rowNode.data] });

          // ztree删除对应的树节点
          this.zWorkflowNodes.splice(
            this.zWorkflowNodes.findIndex(treeNode => treeNode.id === rowNode.data.guid),
            1
          );

          this.deleteWorkflowLoading = false;
          modelRef.close();
          this.toastr.success('业务工作流删除成功!');
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
        name: '添加业务工作流或者业务工作流类别',
        action: () => {
          params.context.componentParent.createWorkflow(null);
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
