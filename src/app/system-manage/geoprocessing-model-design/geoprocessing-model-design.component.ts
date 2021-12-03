import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';

import { STENCIL_WIDTH } from '../../../assets/non-npm/angular-rappid/config/theme';
import { loadStencilTreeLayout } from '../../../assets/non-npm/angular-rappid/rappid/actions';
import { EventBusService } from '../../../assets/non-npm/angular-rappid/services/event-bus.service';
import RappidService from '../../../assets/non-npm/angular-rappid/services/rappid.service';

@Component({
  selector: 'app-geoprocessing-model-design',
  templateUrl: './geoprocessing-model-design.component.html',
  styleUrls: ['./geoprocessing-model-design.component.scss'],
  host: { class: 'rappid-scope shadow' },
  encapsulation: ViewEncapsulation.None,
})
export class GeoprocessingModelDesignComponent implements AfterViewInit, OnDestroy {
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
        'inject-scope': this,
        'toolbar-name': 'geoprocessing-model',
        'stencil-type': 'TREE_LAYOUT',
        'toolbar-save': this.geoprocessingModelSave,
        'toolbar-save-as': this.geoprocessingModelSaveAs,
        'toolbar-debug': this.geoprocessingModelDebug,
      }
    );
    // 设置stencil sidebar面板宽度
    this.renderer.setStyle(stencil.nativeElement, 'width', `${STENCIL_WIDTH * 1.5}px`);

    // 获取stencil的shape模板
    const stencilNodes = {
      name: 'HTML',
      dir: true,
      children: [
        {
          name: 'Favorites',
          icon: 'assets/non-npm/angular-rappid/rappid/stencil/icon/favorite.svg',
          dir: true,
          children: [
            {
              name: 'svg',
              icon: 'assets/non-npm/angular-rappid/rappid/stencil/icon/link.svg',
            },
          ],
        },
        {
          name: 'Document metadata',
          dir: true,
          collapsed: true,
          children: [
            {
              name: 'base',
            },
            {
              name: 'head',
            },
            {
              name: 'link',
            },
            {
              name: 'meta',
            },
            {
              name: 'style',
            },
            {
              name: 'title',
            },
          ],
        },
        {
          name: 'Content sectioning',
          dir: true,
          collapsed: true,
          children: [
            {
              name: 'address',
            },
            {
              name: 'article',
            },
            {
              name: 'aside',
            },
            {
              name: 'footer',
            },
            {
              name: 'header',
            },
            {
              name: 'main',
            },
            {
              name: 'nav',
            },
            {
              name: 'section',
            },
          ],
        },
        {
          name: 'Text content',
          dir: true,
          collapsed: true,
          children: [
            {
              name: 'blockquote',
            },
            {
              name: 'dd',
            },
            {
              name: 'div',
            },
            {
              name: 'dl',
            },
            {
              name: 'dt',
            },
            {
              name: 'figcaption',
            },
            {
              name: 'figure',
            },
            {
              name: 'hr',
            },
            {
              name: 'li',
            },
            {
              name: 'ol',
            },
            {
              name: 'p',
            },
            {
              name: 'pre',
            },
            {
              name: 'ul',
            },
          ],
        },
        {
          name: 'Image and media',
          dir: true,
          collapsed: true,
          children: [
            {
              name: 'area',
            },
            {
              name: 'audio',
            },
            {
              name: 'img',
            },
            {
              name: 'map',
            },
            {
              name: 'track',
            },
            {
              name: 'video',
            },
          ],
        },
        {
          name: 'Embedded content',
          dir: true,
          collapsed: true,
          children: [
            {
              name: 'embed',
            },
            {
              name: 'iframe',
            },
            {
              name: 'object',
            },
            {
              name: 'param',
            },
            {
              name: 'picture',
            },
            {
              name: 'portal',
            },
            {
              name: 'source',
            },
          ],
        },
        {
          name: 'SVG and MathML',
          dir: true,
          collapsed: true,
          children: [
            {
              name: 'svg',
            },
            {
              name: 'math',
            },
          ],
        },
      ],
    };
    loadStencilTreeLayout(this.rappid, stencilNodes);

    // 设置side-bar中svg的height为<g>元素的高度
    // !应该存在更佳的解决方案?
    setTimeout(() => {
      this.element.nativeElement
        .querySelectorAll('.side-bar .content svg')[0]
        .setAttribute('height', `${this.element.nativeElement.querySelectorAll('.side-bar .content svg g')[0].getBBox().height + 100}px`);
    }, 10);

    this.element.nativeElement.querySelectorAll('.side-bar div.search-wrap>input')[0].setAttribute('placeholder', '搜索');

    cdr.detectChanges();
  }

  /**
   * 浏览器窗口变化时，流程图始终在paper区域居中显示
   *
   * @param {UIEvent}  _eventParam $event resize对象信息
   */
  public onResize(_eventParam: UIEvent) {
    this.rappid.scroller.centerContent();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.rappid.destroy();
  }

  /**
   * 地理处理模型保存操作
   */
  public geoprocessingModelSave() {}

  /**
   * 地理处理模型另存为操作
   */
  public geoprocessingModelSaveAs() {}

  /**
   * 地理处理模型测试、试运行操作
   */
  public geoprocessingModelDebug() {}
}
