import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';

import { STENCIL_WIDTH } from '../../../assets/non-npm/angular-rappid/config/theme';
import { loadStencilShapes, importGraphFromJSON, zoomToFit } from '../../../assets/non-npm/angular-rappid/rappid/actions';
import { EventBusService } from '../../../assets/non-npm/angular-rappid/services/event-bus.service';
import RappidService from '../../../assets/non-npm/angular-rappid/services/rappid.service';

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

  public rappid!: RappidService;
  public fileJSON!: Object;

  private subscriptions = new Subscription();

  constructor(
    private element: ElementRef,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    const { element, paper, stencil, toolbar, eventBusService, cdr } = this;
    this.rappid = new RappidService(
      element.nativeElement,
      paper.nativeElement,
      stencil.nativeElement,
      toolbar.nativeElement,
      eventBusService,
      {
        'stencil-group': null,
        'inject-scope': this,
        'toolbar-name': 'flow',
        'toolbar-save': this.flowInformationSave,
        'toolbar-debug': null,
        'toolbar-set-property': this.flowNodeSetProperty,
      }
    );

    // 设置stencil sidebar面板宽度
    this.renderer.setStyle(stencil.nativeElement, 'width', `${STENCIL_WIDTH}px`);

    // 获取stencil的shape模板
    loadStencilShapes(this.rappid);

    // 设置stencil sidebar高度低于内容时显示滚动条
    $('.joint-stencil .content>.joint-paper>svg').height(
      `${$('.joint-stencil .content>.joint-paper>svg>g')[0].getBoundingClientRect().height + 20}px`
    );

    // 从服务器获取流程图信息
    cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.rappid.destroy();
  }

  public openFile(json: Object): void {
    const { rappid } = this;
    this.fileJSON = json;
    importGraphFromJSON(rappid, json);
    zoomToFit(rappid);
  }

  private onStart(): void {
    const { rappid } = this;
    // 获取stencil的shape模板以及流程或者地理模型JSON数据
    loadStencilShapes(rappid);
    //this.openFile(exampleGraphJSON);
  }

  private setStencilContainerSize(): void {
    const { renderer, stencil } = this;
    renderer.setStyle(stencil.nativeElement, 'width', `${STENCIL_WIDTH}px`);
    //this.onStencilToggle();
  }

  private onStencilToggle(): void {
    const { rappid } = this;
    const { scroller, stencil } = rappid;
    if (true) {
      stencil.unfreeze();
      scroller.el.scrollLeft += STENCIL_WIDTH;
    } else {
      stencil.freeze();
      scroller.el.scrollLeft -= STENCIL_WIDTH;
    }
  }

  /**
   * 流程图以及流程节点信息解析保存
   */
  private flowInformationSave() {}

  /**
   * 流程节点属性设置以及流程节点关联的表单的属性设置
   */
  private flowNodeSetProperty() {}
}
