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
import { IFormModel, IFormNotification } from '../../shared/interface/system-manage.interface';
import { FormManageService } from '../service/form-manage.service';
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

  /**Ag-Grid表格,树结构数据显示 */
  public autoGroupColumnDef;
  public getDataPath;
  public groupDefaultExpanded;

  /**搜索框搜索关键字、Ag-Grid快速搜索关键字 */
  public keySearcchValue: string = '';
  public keySearcchValue$ = new Subject<string>();
  public quickFilterText: string = '';

  /**表单数据列表 */
  public formData!: IFormModel[];

  /**创建表单:表单组件、表单信息提示、保存信息提示 */
  public createFormGroup: FormGroup;
  public createFormNotification: IFormNotification;
  public createFormLoading: boolean = false;
  public createFormLoadingText: string = '';

  /**编辑表单:编辑的表单信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editFormGroup: FormGroup;
  public editFormNotification: IFormNotification;
  public editFormLoading: boolean = false;
  public editFormLoadingText: string = '';

  /**删除表单:删除的表单信息(表中一行)、保存信息提示 */
  public deleteFormLoading: boolean = false;
  public deleteFormLoadingText: string = '';
  public deleteRowNode!: RowNode;

  /** ztreeselect 配置项 */
  public rootNodeId = 'e6e9ce2a-e960-4349-b5c0-866cb41d3037';
  public selectType: 'NORMAL' | 'RADIO' | 'CHECK' = 'RADIO';
  public selectMultiple: true | false = false;
  public treeSetting: ISetting = {};
  public zNodes: any[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formManageService: FormManageService,
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

    /**创建表单变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.createFormNotification = {
      name: { message: '请输入表单名称', show: false },
      isLeaf: { message: '请选择类别', show: false },
      category: { message: '请选择表单类别', show: false },
      description: { message: '请输入表单描述', show: false },
    };

    this.createFormGroup = this.fb.group({
      name: [''],
      isLeaf: [1],
      category: [[]],
      description: [''],
    });

    for (const key in this.createFormGroup.controls) {
      if (this.createFormGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.createFormGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.createFormNotification[key].show = false;
          })
        );
      }
    }

    /**编辑表单变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editFormNotification = {
      name: { message: '请输入表单名称', show: false },
      category: { message: '请选择表单类别', show: false },
      description: { message: '请输入表单描述', show: false },
    };

    this.editFormGroup = this.fb.group({
      name: [''],
      category: [[]],
      description: [''],
    });

    for (const key in this.editFormGroup.controls) {
      if (this.editFormGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.editFormGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.editFormNotification[key].show = false;
          })
        );
      }
    }

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
      this.formManageService.getAllForms().subscribe({
        next: res => {
          this.formData = res.formData;
          this.zNodes = [
            { id: this.rootNodeId, pId: '#', name: '表单', chkDisabled: false, open: true },
            ...res.formData.map((item: any) => {
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
   * 新建表单时,直接跳转到模型设计页面,用户设计模型然后保存、另存为
   */
  newForm() {
    this.router.navigate(['../../system-manage/form-design', { guid: '' }], { relativeTo: this.activatedRoute });
  }

  /**
   * 利用ngbModal弹出创建表单对话框
   *
   * @param {RowNode} rowNode 新建表单的表格的父行
   */
  createForm(rowNode: RowNode | null) {
    this.createFormGroup.controls['name'].setValue('');
    this.createFormGroup.controls['description'].setValue('');
    this.createFormGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode?.data?.guid));
    this.createFormGroup.controls['isLeaf'].setValue(1);

    const modalReference = this.modalService.open(this.createFormContent, { centered: true, backdrop: 'static' });

    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.createFormLoading = false;

        Object.assign(this.createFormNotification, {
          name: { message: '请输入表单名称', show: false },
          isLeaf: { message: '请选择类别', show: false },
          category: { message: '请选择表单类别', show: false },
          description: { message: '请输入表单描述', show: false },
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
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.createFormGroup.value[item]) && this.createFormGroup.value[item].length === 0) ||
          (!Array.isArray(this.createFormGroup.value[item]) && !this.createFormGroup.value[item].toString().trim())
        ) {
          this.createFormNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.createFormLoading = true;
    this.createFormLoadingText = '提交中...';

    /**保存到数据库 */
    const newFormInfo: any = {
      id: this.formData.length + 1,
      guid: uuidv4(),
      name: this.createFormGroup.value.name.toString().trim(),
      description: this.createFormGroup.value.description.toString().trim(),
      isLeaf: this.createFormGroup.value.isLeaf === 1,
      parentGuid: this.createFormGroup.value.category[0].id,
    };
    newFormInfo['tree_name'] =
      newFormInfo.parentGuid === this.rootNodeId
        ? newFormInfo.name
        : `${this.gridApi.getRowNode(newFormInfo.parentGuid)!.data['tree_name']}~${newFormInfo.name}`;

    this.subscriptions.push(
      this.formManageService.addForm(newFormInfo).subscribe({
        next: _res => {
          newFormInfo['create_user'] = _res['create_user'];
          newFormInfo['create_time'] = _res['create_time'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ add: [newFormInfo] });

          // ztree-select 添加节点
          this.zNodes.push({
            id: newFormInfo.guid,
            pId: newFormInfo.parentGuid,
            name: newFormInfo.name,
            chkDisabled: newFormInfo.isLeaf,
            isParent: !newFormInfo.isLeaf,
            open: !newFormInfo.isLeaf,
          });

          this.createFormLoading = false;

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
    this.editFormGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode.data.parent_guid));

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editFormContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editFormLoading = false;

        Object.assign(this.editFormNotification, {
          name: { message: '请输入表单名称', show: false },
          category: { message: '请选择表单类别', show: false },
          description: { message: '请输入表单描述', show: false },
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
    /**空字段判断,不能是单独的空格 */
    if (
      !['name', 'category', 'description'].every(item => {
        if (
          (Array.isArray(this.editFormGroup.value[item]) && this.editFormGroup.value[item].length === 0) ||
          (!Array.isArray(this.editFormGroup.value[item]) && !this.editFormGroup.value[item].toString().trim())
        ) {
          this.editFormNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.editFormLoading = true;
    this.editFormLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.name = this.editFormGroup.value.name.toString().trim();
    rowNode.data['parent_guid'] = this.editFormGroup.value.category[0].id;
    rowNode.data.description = this.editFormGroup.value.description.toString().trim();
    this.subscriptions.push(
      this.formManageService.editForm(rowNode.data).subscribe({
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
          this.editFormLoading = false;

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
      this.formManageService.deleteForm(rowNode.data.guid).subscribe({
        next: _res => {
          /**更新Ag-Grid(由于删除一行，ID序号需要修改)、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ remove: [rowNode.data] });

          // ztree删除对应的树节点
          this.zNodes.splice(
            this.zNodes.findIndex(treeNode => treeNode.id === rowNode.data.guid),
            1
          );

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
        name: '添加表单或者类别',
        action: () => {
          params.context.componentParent.createForm(null);
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
