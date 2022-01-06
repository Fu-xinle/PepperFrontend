/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ElementRef, Renderer2, ViewChild, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { fromEvent, filter, map, distinctUntilChanged, debounceTime } from 'rxjs';

import { GeneralUtils } from '../../utils/general.utils';
import { ZtreeComponent } from '../ztree/ztree.component';

@Component({
  selector: 'app-ztree-select',
  templateUrl: './ztree-select.component.html',
  styleUrls: ['./ztree-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZtreeSelectComponent),
      multi: true,
    },
  ],
})
export class ZtreeSelectComponent implements OnInit, ControlValueAccessor {
  @ViewChild('ztreeSelectMenuContainer') ztreeSelectMenuContainer!: ElementRef;
  @ViewChild('ztreeSelectMenu') ztreeSelectMenu!: ElementRef;
  @ViewChild('ztreeSelectControl') ztreeSelectControl!: ElementRef;
  @ViewChild('ztreeSelectControlArrow') ztreeSelectControlArrow!: ElementRef;
  @ViewChild('ztreeSelectSearchInput') ztreeSelectSearchInput!: ElementRef;
  @ViewChild('ztreeSelectTree') ztreeSelectTree!: ZtreeComponent;

  // 搜索文本的值
  public searchText: string = '';
  public searchNoResults = false;

  // 输入参数
  @Input() selectType: 'NORMAL' | 'RADIO' | 'CHECK' = 'NORMAL';
  @Input() selectMultiple: true | false = false;
  @Input() treeSetting: ISetting = {};

  // 输入参数，拦截父组件中值的变化
  private _treeNodes: Array<{ id: string; pId?: string; name: string }> = [];
  @Input()
  get treeNodes(): Array<{ id: string; pId?: string; name: string }> {
    return this._treeNodes;
  }
  set treeNodes(treeNodes: Array<{ id: string; pId?: string; name: string }>) {
    this._treeNodes = treeNodes;
  }

  // 实现ngModel以及formGroup绑定
  private _checkNodes: Array<{ id: string; pId?: string; name: string }> = [];
  @Input()
  get checkNodes(): Array<{ id: string; pId?: string; name: string }> {
    return this._checkNodes;
  }
  set checkNodes(checkNodes: Array<{ id: string; pId?: string; name: string }>) {
    this._checkNodes = checkNodes;
    this.updateCheckNodes();
  }
  onChange: (_: any) => void = (_: any) => {};
  onTouched: () => void = () => {};

  /**
   * 值发生变化时，发送值得变换
   */
  updateCheckNodes() {
    this.onChange(this._checkNodes);
  }

  /**
   * ngModel 赋值时
   *
   * @param {Array<{ id: string; pId?: string; name: string }>} value 设置的新值
   */
  writeValue(value: Array<{ id: string; pId?: string; name: string }>): void {
    if (value !== undefined) {
      this.checkNodes = value;
    }
  }

  /**
   * 控件值发生变化的回调函数
   *
   * @param {(_: any) => void} fn 回调函数
   */
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /**
   * 控件失去焦点时的回调函数
   *
   * @param {() => void} fn 回调函数
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  constructor(private renderer: Renderer2, private element: ElementRef) {}

  ngOnInit() {
    // 属性设置
    if (this.selectType === 'NORMAL') {
      this.treeSetting = GeneralUtils.mergeDeep(this.treeSetting, {
        view: {
          selectedMulti: this.selectMultiple,
          showLine: false,
        },
        check: {
          enable: false,
        },
      });
    } else if (this.selectType === 'RADIO') {
      this.treeSetting = GeneralUtils.mergeDeep(this.treeSetting, {
        view: {
          selectedMulti: false,
        },
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
        },
      });
    } else if (this.selectType === 'CHECK') {
      this.treeSetting = GeneralUtils.mergeDeep(this.treeSetting, {
        view: {
          selectedMulti: true,
        },
        check: {
          enable: true,
          chkStyle: 'checkbox',
        },
      });
    }

    // 用户在dropdownMenu下拉菜单之外单击，收起dropdownMenu下拉菜单
    fromEvent(document, 'click')
      .pipe(
        filter(ev => {
          return (
            (<any>ev).path.indexOf(this.ztreeSelectMenuContainer.nativeElement) === -1 &&
            (<any>ev).path.indexOf(this.ztreeSelectControl.nativeElement) === -1
          );
        })
      )
      .subscribe(() => {
        this.dropdownCloseCSSUpdate();
      });

    /**
     * input输入框搜索事件
     */
    fromEvent(document.getElementById('search-input')!, 'input')
      .pipe(
        map(event => {
          this.searchText = (event.target as HTMLInputElement).value.trim();
          // 根据text长度设置input的宽度
          this.renderer.setStyle(this.ztreeSelectSearchInput.nativeElement, 'width', `${(this.searchText.length + 1) * 12}px`);
          return this.searchText;
        }),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        // 调用ztree搜索
        this.ztreeSelectTree.fuzzySearch(text, false, true, (_searchNodes: any) => {
          this.searchNoResults = !_searchNodes || _searchNodes.length === 0;
        });
      });
  }

  /**
   * div.bootstrap-ztree-select-value-container 的单击事件，input获取焦点，弹出dropdownMenu下拉菜单
   *
   * @param {Event} _event 事件对象
   */
  treeSelectFocus(_event: Event) {
    //input获取焦点
    this.element.nativeElement.querySelector('.bootstrap-ztree-select-input').focus();
    // 弹出dropdownMenu下拉菜单
    this.dropdownOpenCSSUpdate();
  }

  /**
   * dropdownMenu滚动条事件会引起外围滚动事件，阻止事件冒泡
   *
   * @param {Event} event 事件对象
   */
  fireEvent(event: Event) {
    event.stopPropagation();
  }

  /**
   * 选择项的删除事件
   *
   * @param { { id: string; pId?:string; name: string } } node 删除的节点信息
   * @param {string | number} node.id 标识符 id一般为GUID字符串
   * @param {string} node.name 名称
   * @param {string} node.pId  父元素标识符
   * @param {Event} _event 事件对象
   */
  clearSelectNode(node: { id: string; pId?: string; name: string }, _event: Event) {
    const selectNodeCopy = [...this.checkNodes];
    selectNodeCopy.splice(
      this.checkNodes.findIndex(item => item.id === node.id),
      1
    );
    this.checkNodes = selectNodeCopy;
    this.updateCheckNodes();
  }

  /**
   * 选择项清空全部删除事件
   *
   * @param {Event} _event 事件对象
   */
  clearSelectAll(_event: Event) {
    this.checkNodes = [];
    this.updateCheckNodes();
  }

  /**
   * 下拉按钮弹出/收起切换事件
   *
   * @param {Event} _event 事件对象
   */
  toggleDopdown(_event: Event) {
    if (this.ztreeSelectControlArrow.nativeElement.classList.contains('bootstrap-ztree-select-control-arrow-rotate')) {
      this.dropdownCloseCSSUpdate();
    } else {
      this.dropdownOpenCSSUpdate();
    }
  }

  /**
   * ztree树的click事件,选择相应的项
   *
   * @param {{ event: Event; treeId: string; treeNode: any; clickFlag: number }} _event 事件参数
   * @param {Event} _event.event 事件对象
   * @param {string} _event.treeId ztree树的ID字符串
   * @param {any} _event.treeNode 树节点
   * @param {number}  _event.clickFlag click附加参数
   */
  treeNodeClick(_event: { event: Event; treeId: string; treeNode: ITreeNode; clickFlag: number }) {
    if (this.selectType === 'NORMAL') {
      this.updateCheckNodes();
      if (!this.selectMultiple) {
        this.dropdownCloseCSSUpdate();
        this.ztreeSelectSearchInput.nativeElement.value = '';
        this.ztreeSelectTree.fuzzySearch('', false, true, null);
      }
    }
  }

  /**
   * ztree树的Check事件,选择相应的项
   *
   * @param {{ event: Event; treeId: string; treeNode: any }} _event 事件参数
   * @param {Event} _event.event 事件对象
   * @param {string} _event.treeId ztree树的ID字符串
   * @param  {any} _event.treeNode 树节点
   * @param  {number}  _event.clickFlag click附加参数
   */
  treeNodeCheck(_event: { event: Event; treeId: string; treeNode: ITreeNode }) {
    if (this.selectType === 'RADIO' || this.selectType === 'CHECK') {
      this.updateCheckNodes();
    }
    if (this.selectType === 'RADIO') {
      this.dropdownCloseCSSUpdate();
      this.ztreeSelectSearchInput.nativeElement.value = '';
      this.ztreeSelectTree.fuzzySearch('', false, true, null);
    }
  }

  /**
   * treeselect下拉选择打开时，CSS类调整
   */
  private dropdownOpenCSSUpdate() {
    this.renderer.addClass(this.ztreeSelectControlArrow.nativeElement, 'bootstrap-ztree-select-control-arrow-rotate');
    this.renderer.addClass(this.ztreeSelectMenu.nativeElement, 'ztree-select-menu-open');
    this.renderer.addClass(this.ztreeSelectControl.nativeElement, 'bootstrap-ztree-select-control-focus');
    this.renderer.addClass(this.ztreeSelectMenuContainer.nativeElement, 'scroll-bottom-border');
  }

  /**
   * treeselect下拉选择收起时，CSS类调整
   */
  private dropdownCloseCSSUpdate() {
    this.renderer.removeClass(this.ztreeSelectControlArrow.nativeElement, 'bootstrap-ztree-select-control-arrow-rotate');
    this.renderer.removeClass(this.ztreeSelectMenu.nativeElement, 'ztree-select-menu-open');
    this.renderer.removeClass(this.ztreeSelectControl.nativeElement, 'bootstrap-ztree-select-control-focus');
    this.renderer.removeClass(this.ztreeSelectMenuContainer.nativeElement, 'scroll-bottom-border');
  }
}
