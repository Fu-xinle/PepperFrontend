import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  TemplateRef,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { dia } from '@clientio/rappid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { STENCIL_WIDTH } from '../../../assets/non-npm/angular-rappid/config/theme';
import { importGraphFromJSON, loadStencilShapes } from '../../../assets/non-npm/angular-rappid/rappid/actions';
import { EventBusService } from '../../../assets/non-npm/angular-rappid/services/event-bus.service';
import RappidService from '../../../assets/non-npm/angular-rappid/services/rappid.service';
import { IFlowLink, IFlowNode, INameDescriptionNotification } from '../../shared/interface/system-manage.interface';
import { FlowManageService } from '../service/flow-manage.service';

@Component({
  selector: 'app-flow-design',
  templateUrl: './flow-design.component.html',
  styleUrls: ['./flow-design.component.scss'],
  host: { class: 'rappid-scope shadow' },
  encapsulation: ViewEncapsulation.None,
})
export class FlowDesignComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paper') paper!: ElementRef;
  @ViewChild('stencil') stencil!: ElementRef;
  @ViewChild('toolbar') toolbar!: ElementRef;
  // 保存或者另存为对话框
  @ViewChild('saveFlowContent') saveFlowContent!: TemplateRef<void>;

  public rappid!: RappidService;

  /**保存或者另存为对话框:表单组件、表单信息提示、保存信息提示 */
  public saveFlowForm: FormGroup;
  public saveFlowNotification: INameDescriptionNotification;
  public saveFlowLoading: boolean = false;
  public saveFlowLoadingText: string = '';

  /**保存类型：0代表新建保存；1代表修改后保存；2代表另存为，保存新的备份 */
  public flowSaveType: 0 | 1 | 2 = 0;

  /** 流程的唯一标识guid */
  private flowGuid!: string | null;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private flowManageService: FlowManageService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private element: ElementRef,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    /**创建流程变量初始化:信息提示对象、表单对象初始化，监测Input事件 */
    this.saveFlowNotification = {
      nameMessageShow: false,
      nameMessage: '请输入流程名称',
      descriptionMessageShow: false,
      descriptionMessage: '请输入流程描述',
    };

    this.saveFlowForm = this.fb.group({
      name: [''],
      description: [''],
    });

    this.subscriptions.add(
      this.saveFlowForm.controls['name'].valueChanges.subscribe((_value: string) => {
        this.saveFlowNotification.nameMessageShow = false;
      })
    );

    this.subscriptions.add(
      this.saveFlowForm.controls['description'].valueChanges.subscribe((_value: string) => {
        this.saveFlowNotification.descriptionMessageShow = false;
      })
    );
  }

  public ngAfterViewInit(): void {
    const { element, paper, stencil, toolbar, eventBusService, cdr } = this;
    this.rappid = new RappidService(
      element.nativeElement,
      paper.nativeElement,
      stencil.nativeElement,
      toolbar.nativeElement,
      eventBusService,
      {
        'inject-scope': this,
        'toolbar-name': 'flow',
        'stencil-type': 'LIST_LAYOUT',
        'toolbar-save': this.flowInformationSave,
        'toolbar-save-as': this.flowInformationSaveAs,
        'toolbar-set-property': this.flowNodeSetProperty,
      }
    );

    // 设置stencil sidebar面板宽度
    this.renderer.setStyle(stencil.nativeElement, 'width', `${STENCIL_WIDTH}px`);

    // 获取stencil的shape模板
    loadStencilShapes(this.rappid);

    // 设置side-bar中svg的height为<g>元素的高度
    // !应该存在更佳的解决方案?
    this.element.nativeElement
      .querySelectorAll('.side-bar .content svg')[0]
      .setAttribute('height', `${this.element.nativeElement.querySelectorAll('.side-bar .content svg g')[0].getBBox().height + 10}px`);

    // 从路由中获取流程的guid
    this.flowGuid = this.route.snapshot.paramMap.get('guid');
    this.flowSaveType = this.flowGuid ? 1 : 0;

    // 从服务器获取流程图数据，打开显示
    if (this.flowGuid) {
      this.subscriptions.add(
        this.flowManageService.getFlowDiagram(this.flowGuid).subscribe({
          next: res => {
            importGraphFromJSON(this.rappid, res.diagramJson);
            this.rappid.scroller.centerContent();
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

    cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.rappid.destroy();
  }

  /**
   * 浏览器窗口变化时，流程图始终在paper区域居中显示
   *
   * @param {UIEvent}  _eventParam $event resize对象信息
   */
  public onResize(_eventParam: UIEvent) {
    this.rappid.scroller.centerContent();
  }

  /**
   * 流程图以及流程节点信息解析保存，
   */
  public flowInformationSave() {
    if (this.flowGuid) {
      /**直接保存流程图和流程结构*/
      this.subscriptions.add(
        this.flowManageService
          .saveFlowDiagram(this.flowGuid, this.flowNodesLinksStructure().flowNodesArray, JSON.stringify(this.rappid.graph.toJSON()))
          .subscribe({
            next: _res => {
              this.toastr.success('流程保存成功!');
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
    } else {
      /**弹出对话框，新建流程信息，保存流程图 */
      this.openSaveFlowModal();
    }
  }

  /**
   * 流程图以及流程节点信息解析另存为新的一个流程
   */
  public flowInformationSaveAs() {
    /**另存为对框框：弹出对话框（对话框的标题不同），新建流程信息，保存流程图 */
    this.flowSaveType = 2;
    this.openSaveFlowModal();
  }

  /**
   * 流程节点属性设置以及流程节点关联的表单的属性设置
   */
  public flowNodeSetProperty() {}

  /**
   * 新建或另存为流程对话框,单击保存事件==>将流程以及流程图信息保存到数据库
   *
   * @param {NgbModalRef} modelRef Paramater 对话框对象引用
   */
  public saveFlowModalOK(modelRef: NgbModalRef) {
    /**判断名称不能为空，描述暂时不判断、可以为空 */
    const name: string = this.saveFlowForm.value.name.toString().trim();
    if (name.length === 0) {
      this.saveFlowNotification.nameMessageShow = true;
      this.saveFlowNotification.nameMessage = '请输入流程名称';
      return;
    }

    this.saveFlowLoading = true;
    this.saveFlowLoadingText = '提交中...';

    /**保存到数据库 */
    const newGuid: string = uuidv4();
    const newFlowInfo = {
      guid: newGuid,
      name: this.saveFlowForm.value.name.toString().trim(),
      description: this.saveFlowForm.value.description.toString().trim(),
    };
    this.subscriptions.add(
      this.flowManageService
        .newAndSaveAsFlow(newFlowInfo, this.flowNodesLinksStructure().flowNodesArray, JSON.stringify(this.rappid.graph.toJSON()))
        .subscribe({
          next: _res => {
            /**表单对象、关闭对话框、toastr提示 */
            this.saveFlowLoading = false;
            this.saveFlowForm.controls['name'].setValue('');
            this.saveFlowForm.controls['description'].setValue('');

            modelRef.close();
            if (this.flowGuid) {
              this.toastr.success('流程另存为成功!');
            } else {
              this.toastr.success('新建流程保存成功!');
            }
            this.flowGuid = newGuid;
            this.flowSaveType = 1;
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
   * 打开保存流程或者流程另存为对话框
   */
  private openSaveFlowModal() {
    const modalReference: NgbModalRef = this.modalService.open(this.saveFlowContent, { centered: true, backdrop: 'static' });

    modalReference.result.then(
      _result => {},
      _reason => {
        // 其他关闭
        this.saveFlowLoading = false;
        this.saveFlowForm.controls['name'].setValue('');
        this.saveFlowForm.controls['description'].setValue('');
        Object.assign(this.saveFlowNotification, {
          nameMessageShow: false,
          nameMessage: '请输入流程名称',
          descriptionMessageShow: false,
          descriptionMessage: '请输入流程描述',
        });
      }
    );
  }

  /**
   * 流程图进行解析，获取流程图中包含的节点和连线信息
   *
   * @returns {{flowNodesArray:IFlowNode[] ,
   *            flowLinksArray:IFlowLink[]}} 流程图中包含的节点和连线信息
   */
  private flowNodesLinksStructure() {
    // 变量
    const flowNodesArray: IFlowNode[] = [];
    const flowNodesDic: {
      [key: string]: { guid: string; name: string | undefined; nextNodesGuidArray: string[] };
    } = {};
    const flowLinksArray: IFlowLink[] = [];

    // 节点元素
    const elementsArray: Array<dia.Element<dia.Element.Attributes, dia.ModelSetOptions>> = this.rappid.graph.getElements();
    for (const element of elementsArray) {
      if (element.attributes.type === 'app.FlowNode' || element.attributes.type === 'app.BranchNode') {
        flowNodesDic[element.id] = {
          guid: element.id as string,
          name: element.attributes?.attrs?.label?.text,
          nextNodesGuidArray: [],
        };
      }
    } // for

    // 连线
    const linksArray: Array<dia.Link<dia.Link.Attributes, dia.ModelSetOptions>> = this.rappid.graph.getLinks();
    for (const link of linksArray) {
      if (flowNodesDic[link.attributes.source.id] && flowNodesDic[link.attributes.target.id]) {
        flowNodesDic[link.attributes.source.id].nextNodesGuidArray.push(flowNodesDic[link.attributes.target.id].guid);
      }
      flowLinksArray.push({
        sourceGuid: link.attributes.source.id,
        targetGuid: link.attributes.target.id,
      });
    }

    // 结构解析
    for (const key in flowNodesDic) {
      if (flowNodesDic.hasOwnProperty(key)) {
        const node = flowNodesDic[key];
        if (node.nextNodesGuidArray.length === 0) {
          flowNodesArray.push({
            guid: node.guid,
            nodeName: node.name,
            nextNodeGuid: null,
          });
        } else {
          for (const nextNodeGuid of node.nextNodesGuidArray) {
            flowNodesArray.push({
              guid: node.guid,
              nodeName: node.name,
              nextNodeGuid: nextNodeGuid,
            });
          }
        }
      }
    } // for

    return { flowNodesArray, flowLinksArray };
  }
}
