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
import { IWordChineseEnglish } from '../../shared/interface/development-operations.interface';
import { IFormNotification } from '../../shared/interface/system-manage.interface';
import { WordChineseEnglishService } from '../service/word-chinese-english.service';
import { WordChineseEnglishCrudOperationComponent } from './word-chinese-english-crud-opeartion.component';

@Component({
  selector: 'app-word-chinese-english',
  templateUrl: './word-chinese-english.component.html',
  styleUrls: ['./word-chinese-english.component.scss'],
})
export class WordChineseEnglishComponent implements OnInit, OnDestroy {
  /**对话框模板引用,利用ngbModal创建对话框，编辑词汇项信息、删除词汇项 */
  @ViewChild('createWordChineseEnglishContent') createWordChineseEnglishContent!: TemplateRef<void>;
  @ViewChild('editWordChineseEnglishContent') editWordChineseEnglishContent!: TemplateRef<void>;
  @ViewChild('deleteWordChineseEnglishContent') deleteWordChineseEnglishContent!: TemplateRef<void>;

  /**Ag-Grid表格列配置信息 */
  public columnDefs = [
    {
      headerName: '英文名称',
      field: 'englishName',
      suppressMenu: true,
      flex: 1,
      minWidth: 250,
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
      cellRenderer: 'wordChineseEnglishCrudOperationComponent',
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

  /**词汇项数据列表 */
  public wordChineseEnglishData!: IWordChineseEnglish[];

  /**创建词汇项:表单组件、表单信息提示、保存信息提示 */
  public createWordChineseEnglishGroup: FormGroup;
  public createWordChineseEnglishNotification: IFormNotification;
  public createWordChineseEnglishLoading: boolean = false;
  public createWordChineseEnglishLoadingText: string = '';

  /**编辑词汇项:编辑的词汇信息(表中一行)、表单组件、表单信息提示、保存信息提示 */
  public editRowNode!: RowNode;
  public editWordChineseEnglishGroup: FormGroup;
  public editWordChineseEnglishNotification: IFormNotification;
  public editWordChineseEnglishLoading: boolean = false;
  public editWordChineseEnglishLoadingText: string = '';

  /**删除词汇项:删除的词汇信息(表中一行)、保存信息提示 */
  public deleteRowNode!: RowNode;
  public deleteWordChineseEnglishLoading: boolean = false;
  public deleteWordChineseEnglishLoadingText: string = '';

  /** ztreeselect 配置项 */
  public rootNodeId = '4dba9686-8412-4a14-8ddf-a7c48c8e446d';
  public selectType: 'NORMAL' | 'RADIO' | 'CHECK' = 'RADIO';
  public selectMultiple: true | false = false;
  public treeSetting: ISetting = {};
  public zNodes: any[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private wordChineseEnglishService: WordChineseEnglishService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    /**Ag-Grid表格,树结构数据显示 */
    this.autoGroupColumnDef = {
      headerName: '中文名称',
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
      return data.treeChineseName.split('~');
    };

    this.groupDefaultExpanded = 1;

    /**创建词汇项变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.createWordChineseEnglishNotification = {
      chineseName: { message: '请输入词汇中文名称', show: false },
      englishName: { message: '请输入词汇英文名称', show: false },
      isLeaf: { message: '请选择类别', show: false },
      category: { message: '请选择词汇项所属目录', show: false },
    };

    this.createWordChineseEnglishGroup = this.fb.group({
      chineseName: [''],
      englishName: [''],
      isLeaf: [1],
      category: [[]],
    });

    for (const key in this.createWordChineseEnglishGroup.controls) {
      if (this.createWordChineseEnglishGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.createWordChineseEnglishGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.createWordChineseEnglishNotification[key].show = false;
          })
        );
      }
    }

    /**编辑词汇项变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.editWordChineseEnglishNotification = {
      chineseName: { message: '请输入词汇中文名称', show: false },
      englishName: { message: '请输入词汇英文名称', show: false },
      category: { message: '请选择词汇项所属目录', show: false },
    };

    this.editWordChineseEnglishGroup = this.fb.group({
      chineseName: [''],
      englishName: [''],
      category: [[]],
    });

    for (const key in this.editWordChineseEnglishGroup.controls) {
      if (this.editWordChineseEnglishGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.editWordChineseEnglishGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.editWordChineseEnglishNotification[key].show = false;
          })
        );
      }
    }

    /**Ag-Grid表格的加载显示和空数据显示,自定义重载*/
    this.frameworkComponents = {
      wordChineseEnglishCrudOperationComponent: WordChineseEnglishCrudOperationComponent,
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

    /**从服务器获取已有词汇数组，显示在Ag-Grid表格中 */
    this.subscriptions.push(
      this.wordChineseEnglishService.getAllWordChineseEnglishs().subscribe({
        next: res => {
          this.wordChineseEnglishData = res.wordChineseEnglishData;
          this.zNodes = [
            { id: this.rootNodeId, pId: '#', name: '词汇表', chkDisabled: false, open: true, isParent: true },
            ...res.wordChineseEnglishData.map((item: any) => {
              return {
                id: item.guid,
                pId: item.parentGuid,
                name: item.chineseName,
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
   * 利用ngbModal弹出创建词汇项对话框
   *
   * @param {RowNode} rowNode 新建词汇项的表格的父行
   */
  createWordChineseEnglish(rowNode: RowNode | null) {
    this.createWordChineseEnglishGroup.controls['chineseName'].setValue('');
    this.createWordChineseEnglishGroup.controls['englishName'].setValue('');
    this.createWordChineseEnglishGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode?.data?.guid));
    this.createWordChineseEnglishGroup.controls['isLeaf'].setValue(1);

    const modalReference = this.modalService.open(this.createWordChineseEnglishContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.createWordChineseEnglishLoading = false;

        Object.assign(this.createWordChineseEnglishNotification, {
          chineseName: { message: '请输入词汇中文名称', show: false },
          englishName: { message: '请输入词汇英文名称', show: false },
          isLeaf: { message: '请选择类别', show: false },
          category: { message: '请选择词汇项所属目录', show: false },
        });
      }
    );
  }

  /**
   * 创建词汇项对话框,单击保存事件，将新创建词汇项保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  createWordChineseEnglishSave(modelRef: NgbModalRef) {
    /**空字段判断,不能是单独的空格 */
    if (
      !['chineseName', 'englishName', 'category'].every(item => {
        if (
          (Array.isArray(this.createWordChineseEnglishGroup.value[item]) && this.createWordChineseEnglishGroup.value[item].length === 0) ||
          (!Array.isArray(this.createWordChineseEnglishGroup.value[item]) &&
            !this.createWordChineseEnglishGroup.value[item].toString().trim())
        ) {
          this.createWordChineseEnglishNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.createWordChineseEnglishLoading = true;
    this.createWordChineseEnglishLoadingText = '提交中...';

    /**保存到数据库 */
    const newWordChineseEnglishInfo: any = {
      id: this.wordChineseEnglishData.length + 1,
      guid: uuidv4(),
      chineseName: this.createWordChineseEnglishGroup.value.chineseName.toString().trim(),
      englishName: this.createWordChineseEnglishGroup.value.englishName.toString().trim(),
      isLeaf: this.createWordChineseEnglishGroup.value.isLeaf === 1,
      parentGuid: this.createWordChineseEnglishGroup.value.category[0].id,
    };
    newWordChineseEnglishInfo['treeChineseName'] =
      newWordChineseEnglishInfo.parentGuid === this.rootNodeId
        ? newWordChineseEnglishInfo.chineseName
        : `${this.gridApi.getRowNode(newWordChineseEnglishInfo.parentGuid)!.data['treeChineseName']}~${
            newWordChineseEnglishInfo.chineseName
          }`;

    this.subscriptions.push(
      this.wordChineseEnglishService.addWordChineseEnglish(newWordChineseEnglishInfo).subscribe({
        next: _res => {
          newWordChineseEnglishInfo['createUser'] = _res['createUser'];
          newWordChineseEnglishInfo['createTime'] = _res['createTime'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ add: [newWordChineseEnglishInfo] });

          // ztree-select 添加节点
          this.zNodes.push({
            id: newWordChineseEnglishInfo.guid,
            pId: newWordChineseEnglishInfo.parentGuid,
            name: newWordChineseEnglishInfo.chineseName,
            chkDisabled: newWordChineseEnglishInfo.isLeaf,
            isParent: !newWordChineseEnglishInfo.isLeaf,
            open: !newWordChineseEnglishInfo.isLeaf,
          });

          this.createWordChineseEnglishLoading = false;

          modelRef.close();
          this.toastr.success('新词汇项添加成功!');
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
   * 利用ngbModal弹出编辑词汇项对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即编辑的词汇项信息
   */
  editWordChineseEnglish(rowNode: RowNode) {
    // 对话框值填充
    this.editWordChineseEnglishGroup.controls['chineseName'].setValue(rowNode.data.chineseName);
    this.editWordChineseEnglishGroup.controls['englishName'].setValue(rowNode.data.englishName);
    this.editWordChineseEnglishGroup.controls['category'].setValue(this.zNodes.filter(item => item.id === rowNode.data.parentGuid));

    this.editRowNode = rowNode;

    const modalReference = this.modalService.open(this.editWordChineseEnglishContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.editWordChineseEnglishLoading = false;
        Object.assign(this.editWordChineseEnglishNotification, {
          chineseName: { message: '请输入词汇中文名称', show: false },
          englishName: { message: '请输入词汇英文名称', show: false },
          category: { message: '请选择词汇项所属目录', show: false },
        });
      }
    );
  }

  /**
   * 编辑词汇项对话框,单击保存事件，将修改保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  editWordChineseEnglishSave(modelRef: NgbModalRef) {
    /**空字段判断,不能是单独的空格 */
    if (
      !['chineseName', 'englishName', 'category'].every(item => {
        if (
          (Array.isArray(this.editWordChineseEnglishGroup.value[item]) && this.editWordChineseEnglishGroup.value[item].length === 0) ||
          (!Array.isArray(this.editWordChineseEnglishGroup.value[item]) && !this.editWordChineseEnglishGroup.value[item].toString().trim())
        ) {
          this.editWordChineseEnglishNotification[item].show = true;
          return false;
        }
        return true;
      })
    ) {
      return;
    }

    this.editWordChineseEnglishLoading = true;
    this.editWordChineseEnglishLoadingText = '提交中...';

    /**保存到数据库 */
    const rowNode = this.editRowNode;
    rowNode.data.chineseName = this.editWordChineseEnglishGroup.value.chineseName.toString().trim();
    rowNode.data['parentGuid'] = this.editWordChineseEnglishGroup.value.category[0].id;
    rowNode.data.englishName = this.editWordChineseEnglishGroup.value.englishName.toString().trim();
    this.subscriptions.push(
      this.wordChineseEnglishService.editWordChineseEnglish(rowNode.data).subscribe({
        next: _res => {
          rowNode.data['createUser'] = _res['createUser'];
          rowNode.data['createTime'] = _res['createTime'];

          /**更新Ag-Grid、表单对象、关闭对话框、toastr提示 */
          var rowsToUpdate = this.getRowsToUpdate(
            rowNode,
            rowNode.data['parentGuid'] === this.rootNodeId
              ? ''
              : this.gridApi.getRowNode(rowNode.data['parentGuid'])!.data['treeChineseName']
          );
          this.gridApi.applyTransaction({ update: rowsToUpdate });

          // ztree-select 对应的节点也更新
          this.zNodes.some(treeNode => {
            if (treeNode.id === rowNode.data.guid) {
              treeNode.name = rowNode.data.chineseName;
              treeNode.pId = rowNode.data['parentGuid'];
              return true;
            }
            return false;
          });
          this.editWordChineseEnglishLoading = false;

          modelRef.close();
          this.toastr.success('词汇项信息修改成功!');
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
   * 利用ngbModal弹出删除词汇项对话框
   *
   * @param {RowNode} rowNode Parameter Ag-Grid表格中行数据,即删除的词汇项信息
   */
  deleteWordChineseEnglish(rowNode: RowNode) {
    this.deleteRowNode = rowNode;

    const modalReference = this.modalService.open(this.deleteWordChineseEnglishContent, { centered: true, backdrop: 'static' });
    modalReference.result.then(
      _result => {},
      _reason => {
        this.deleteWordChineseEnglishLoading = false;
      }
    );
  }

  /**
   * 删除词汇项对话框,单击保存事件，从数据库中删除词汇项
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  deleteWordChineseEnglishSave(modelRef: NgbModalRef) {
    const rowNode = this.deleteRowNode;

    if (rowNode.childrenAfterGroup!.length > 0) {
      modelRef.close();
      this.toastr.error('词汇项类别包含子项', '错误');
      return;
    }

    this.deleteWordChineseEnglishLoading = true;
    this.deleteWordChineseEnglishLoadingText = '删除中...';

    /**保存到数据库 */
    this.subscriptions.push(
      this.wordChineseEnglishService.deleteWordChineseEnglish(rowNode.data.guid).subscribe({
        next: _res => {
          /**更新Ag-Grid(由于删除一行，ID序号需要修改)、表单对象、关闭对话框、toastr提示 */
          this.gridApi.applyTransaction({ remove: [rowNode.data] });

          // ztree删除对应的树节点
          this.zNodes.splice(
            this.zNodes.findIndex(treeNode => treeNode.id === rowNode.data.guid),
            1
          );

          this.deleteWordChineseEnglishLoading = false;
          modelRef.close();
          this.toastr.success('词汇项删除成功!');
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
        name: '添加词汇项或者类别',
        action: () => {
          params.context.componentParent.createWordChineseEnglish(null);
        },
        icon: '<i class="icon-Add text-16"></i>',
      },
    ];
  }

  /**
   * 树形表格信息修改设计所属类别移动
   *
   * @param {RowNode} node 表格中修改的当前行
   * @param {string} parenTreeChineseName 表格中父行的treeChineseName
   * @returns {any[]} 需要更新的行
   */
  private getRowsToUpdate(node: RowNode, parenTreeChineseName: string) {
    var res: any[] = [];
    var newTreeChineseName = parenTreeChineseName ? `${parenTreeChineseName}~${node.data['chineseName']}` : node.data['chineseName'];
    if (node.data) {
      node.data['treeChineseName'] = newTreeChineseName;
    }
    for (var i = 0; i < node.childrenAfterGroup!.length; i++) {
      var updatedChildRowData = this.getRowsToUpdate(node.childrenAfterGroup![i], newTreeChineseName);
      res = res.concat(updatedChildRowData);
    }
    return node.data ? res.concat([node.data]) : res;
  }
}
