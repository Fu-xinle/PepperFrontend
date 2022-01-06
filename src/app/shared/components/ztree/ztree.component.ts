/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { GeneralUtils } from '../../utils/general.utils';

@Component({
  selector: 'app-ztree',
  templateUrl: './ztree.component.html',
  styleUrls: ['./ztree.component.scss'],
})
export class ZtreeComponent implements OnInit {
  public treeObj!: IzTreeObj;
  // 输出事件
  @Output() readonly remove = new EventEmitter<{ event: Event; treeId: string; treeNode: ITreeNode }>();
  @Output() readonly rename = new EventEmitter<{ event: Event; treeId: string; treeNode: ITreeNode; isCancel: boolean }>();
  @Output() readonly click = new EventEmitter<{ event: Event; treeId: string; treeNode: ITreeNode; clickFlag: number }>();
  @Output() readonly check = new EventEmitter<{ event: Event; treeId: string; treeNode: ITreeNode }>();
  @Output() readonly drop = new EventEmitter<{
    event: Event;
    treeId: string;
    treeNodes: ITreeNode[];
    targetNode: object;
    moveType: string;
    isCopy: boolean;
  }>();

  // !!双向绑定:对象引用改变才是更改，属性变化不是，父组件与子组件对象只有一个，使用的是引用
  @Output() readonly checkNodesChange = new EventEmitter<Array<{ id: string; pId?: string; name: string }>>();
  private _checkNodes: Array<{ id: string; pId?: string; name: string }> = [];
  @Input()
  get checkNodes(): Array<{ id: string; pId?: string; name: string }> {
    return this._checkNodes;
  }
  set checkNodes(checkNodes: Array<{ id: string; pId?: string; name: string }>) {
    if (this.treeObj) {
      this.treeObj.cancelSelectedNode();
      this.treeObj.checkAllNodes(false);
      this.checkNodes.forEach((value: ITreeNode, _index: number, _array: ITreeNode[]) => {
        this.treeObj.checkNode(
          this.treeObj.getNodesByFilter(node => node.id === value.id, true),
          false,
          true,
          false
        );
      });
    }
    this._checkNodes = checkNodes;
    if (this.treeObj) {
      if (this.checkNodes) {
        if (this.selectType === 'NORMAL') {
          if (!this.selectMultiple) {
            this.checkNodes.splice(1, this.checkNodes.length - 1);
          }
          this.checkNodes.forEach((value: ITreeNode, _index: number, _array: ITreeNode[]) => {
            this.treeObj.selectNode(
              this.treeObj.getNodesByFilter(node => node.id === value.id, true),
              true,
              false
            );
          });
        } else if (this.selectType === 'RADIO' || this.selectType === 'CHECK') {
          if (this.selectType === 'RADIO') {
            this.checkNodes.splice(1, this.checkNodes.length - 1);
          }
          this.checkNodes.forEach((value: ITreeNode, _index: number, _array: ITreeNode[]) => {
            this.treeObj.checkNode(
              this.treeObj.getNodesByFilter(node => node.id === value.id, true),
              true,
              true,
              false
            );
          });
        }
      }
    }
  }

  // 输入属性:treeSetting初始化后，不支持更改，可以修改
  @Input() treeSetting: ISetting = {};
  @Input() selectType: 'NORMAL' | 'RADIO' | 'CHECK' = 'NORMAL';
  @Input() selectMultiple: true | false = true;

  // 输入属性：treeNodes，使用setter响应拦截父组件中值的变化
  private _treeNodes: Array<{ id: string; pId?: string; name: string }> = [];
  @Input()
  get treeNodes(): Array<{ id: string; pId?: string; name: string }> {
    return this._treeNodes;
  }
  set treeNodes(treeNodes: Array<{ id: string; pId?: string; name: string }>) {
    this._treeNodes = treeNodes;
    if (this.treeObj) {
      this.treeObj = $.fn.zTree.init!($('ul.ztree'), this.treeSetting, this.treeNodes);
    }
  }

  constructor() {}

  ngOnInit() {
    /** 树进行一些默认设置 */
    this.treeSetting = GeneralUtils.mergeDeep(
      {
        view: {
          addHoverDom: this.treeSetting?.edit?.enable
            ? (treeId: string, treeNode: ITreeNode) => {
                var treeNodeSpan = $(`#${treeNode.tId}_span`);
                if (treeNode.editNameFlag || $(`#addBtn_${treeNode.tId}`).length > 0) return;
                var addSpan = `<span class='button add' id='addBtn_${treeNode.tId}' title onfocus='this.blur();'></span>`;
                treeNodeSpan.after(addSpan);
                var btn = $(`#addBtn_${treeNode.tId}`);
                if (btn)
                  btn.on('click', () => {
                    const newNodes: ITreeNode = { id: uuidv4(), pId: treeNode.id, name: `新建节点` };
                    this.treeObj.addNodes(treeNode, -1, newNodes);
                    return false;
                  });
              }
            : undefined,
          removeHoverDom: (treeId: string, treeNode: ITreeNode) => {
            $(`#addBtn_${treeNode.tId}`).off().remove();
          },
          showTitle: false,
          showIcon: false,
        },
        data: {
          simpleData: {
            enable: true,
            rootPId: '#',
          },
        },
        edit: {
          removeTitle: '',
          renameTitle: '',
        },
        callback: {
          onRemove: (event: Event, treeId: string, treeNode: ITreeNode) => {
            this.remove.emit({ event, treeId, treeNode });
          },
          onRename: (event: Event, treeId: string, treeNode: ITreeNode, isCancel: boolean) => {
            this.rename.emit({ event, treeId, treeNode, isCancel });
          },
          beforeClick: (_treeId: string, treeNode: ITreeNode, _clickFlag: number) => {
            if (this.selectType === 'RADIO' || this.selectType === 'CHECK') {
              this.treeObj.checkNode(treeNode, !treeNode.checked, true, true);
              return false;
            }
            return true;
          },
          onClick: (event: Event, treeId: string, treeNode: ITreeNode, clickFlag: number) => {
            if (this.selectType === 'NORMAL') {
              if (this.selectMultiple) {
                // 多选
                if (this.checkNodes.findIndex(node => node.id === treeNode.id) === -1) {
                  this.checkNodes.push({ id: treeNode.id, pId: treeNode.pId, name: treeNode.name! });
                } else {
                  this.checkNodes.splice(
                    this.checkNodes.findIndex(node => node.id === treeNode.id),
                    1
                  );
                }
                this.treeObj.cancelSelectedNode();
                this.checkNodes.forEach((value: ITreeNode, _index: number, _array: ITreeNode[]) => {
                  this.treeObj.selectNode(
                    this.treeObj.getNodesByFilter(node => node.id === value.id, true),
                    true,
                    false
                  );
                });
              } else {
                // 单选
                this.checkNodes.splice(0, this.checkNodes.length);
                this.checkNodes.push({ id: treeNode.id, pId: treeNode.pId, name: treeNode.name! });
              }
              this.click.emit({ event, treeId, treeNode, clickFlag });
              this.checkNodesChange.emit(this.checkNodes);
            }
          },
          onCheck: (event: Event, treeId: string, treeNode: ITreeNode) => {
            if (treeNode.checked) {
              if (this.selectType === 'RADIO') {
                this.checkNodes.splice(0, this.checkNodes.length);
              }
              this.checkNodes.push({ id: treeNode.id, pId: treeNode.pId, name: treeNode.name! });
            } else {
              this.checkNodes.splice(
                this.checkNodes.findIndex(node => node.id === treeNode.id),
                1
              );
            }
            this.check.emit({ event, treeId, treeNode });
            this.checkNodesChange.emit(this.checkNodes);
          },
          onDrop: (event: Event, treeId: string, treeNodes: ITreeNode[], targetNode: object, moveType: string, isCopy: boolean) => {
            this.drop.emit({ event, treeId, treeNodes, targetNode, moveType, isCopy });
          },
        },
      },
      this.treeSetting
    );

    // 初始化操作
    this.treeObj = $.fn.zTree.init!($('ul.ztree'), this.treeSetting, this.treeNodes);

    // 选中初始节点
    if (this.checkNodes) {
      if (this.selectType === 'NORMAL') {
        if (!this.selectMultiple) {
          this.checkNodes.splice(1, this.checkNodes.length - 1);
        }
        this.checkNodes.forEach((value: ITreeNode, _index: number, _array: ITreeNode[]) => {
          this.treeObj.selectNode(
            this.treeObj.getNodesByFilter(node => node.id === value.id, true),
            true,
            false
          );
        });
      } else if (this.selectType === 'RADIO' || this.selectType === 'CHECK') {
        if (this.selectType === 'RADIO') {
          this.checkNodes.splice(1, this.checkNodes.length - 1);
        }
        this.checkNodes.forEach((value: ITreeNode, _index: number, _array: ITreeNode[]) => {
          this.treeObj.checkNode(
            this.treeObj.getNodesByFilter(node => node.id === value.id, true),
            true,
            true,
            false
          );
        });
      }
    }
  }

  // ztree的模糊查询
  public fuzzySearch(keywords: string, isHighLight: boolean | undefined, isExpand: boolean, callBackFunc: any) {
    var nameKey = this.treeObj.setting?.data?.key?.name; //get the key of the node name
    isHighLight = isHighLight === false ? false : true; //default true, only use false to disable highlight
    isExpand = isExpand ? true : false; // not to expand in default
    this.treeObj.setting!.view!.nameIsHTML = isHighLight; //allow use html in node name for highlight use

    var metaChar = '[\\[\\]\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'; //js meta characters
    var rexMeta = new RegExp(metaChar, 'gi'); //regular expression to match meta characters

    // keywords filter
    const ztreeFilter = (_keywords: string) => {
      if (!_keywords) {
        _keywords = '';
      }

      const filterFunc = (node: ITreeNode) => {
        if (node && node.oldname && node.oldname.length > 0) {
          node[nameKey!] = node.oldname; //recover oldname of the node if exist
        }
        this.treeObj.updateNode(node); //update node to for modifications take effect
        if (_keywords.length == 0) {
          //return true to show all nodes if the keyword is blank
          this.treeObj.showNode(node);
          this.treeObj.expandNode(node, isExpand);
          return true;
        }

        //transform node name and keywords to lowercase
        if (node[nameKey!] && node[nameKey!].toLowerCase().indexOf(_keywords.toLowerCase()) != -1) {
          if (isHighLight) {
            //highlight process
            //a new variable 'newKeywords' created to store the keywords information
            //keep the parameter '_keywords' as initial and it will be used in next node
            //process the meta characters in _keywords thus the RegExp can be correctly used in str.replace
            var newKeywords = _keywords.replace(rexMeta, (matchStr: string) => {
              //add escape character before meta characters
              return `\\${matchStr}`;
            });
            node.oldname = node[nameKey!]; //store the old name
            var rexGlobal = new RegExp(newKeywords, 'gi'); //'g' for global,'i' for ignore case
            //use replace(RegExp,replacement) since replace(/substr/g,replacement) cannot be used here
            node[nameKey!] = node.oldname.replace(rexGlobal, (originalText: string) => {
              //highlight the matching words in node name
              var highLightText = `<span style="color: whitesmoke;background-color: #639;">${originalText}</span>`;
              return highLightText;
            });
            this.treeObj.updateNode(node); //update node for modifications take effect
          }
          this.treeObj.showNode(node); //show node with matching keywords
          return true; //return true and show this node
        }

        this.treeObj.hideNodes([node]); // hide node that not matched
        return false; //return false for node not matched
      };

      var nodesShow = this.treeObj.getNodesByFilter(filterFunc); //get all nodes that would be shown
      processShowNodes(nodesShow, _keywords); //nodes should be reprocessed to show correctly
      if (callBackFunc) {
        callBackFunc(nodesShow);
      }
    };

    const processShowNodes = (nodesShow: any, _keywords: string) => {
      if (nodesShow && nodesShow.length > 0) {
        //process the ancient nodes if _keywords is not blank
        if (_keywords.length > 0) {
          $.each(nodesShow, (n, obj) => {
            var pathOfOne = obj.getPath(); //get all the ancient nodes including current node
            if (pathOfOne && pathOfOne.length > 0) {
              //i < pathOfOne.length-1 process every node in path except self
              for (var i = 0; i < pathOfOne.length - 1; i++) {
                this.treeObj.showNode(pathOfOne[i]); //show node
                this.treeObj.expandNode(pathOfOne[i], true); //expand node
              }
            }
          });
        } else {
          //show all nodes when _keywords is blank and expand the root nodes
          var rootNodes = this.treeObj.getNodesByParam('level', '0'); //get all root nodes
          $.each(rootNodes, (n, obj) => {
            this.treeObj.expandNode(obj, true); //expand all root nodes
          });
        }
      }
    };

    ztreeFilter(keywords);
  }
}
