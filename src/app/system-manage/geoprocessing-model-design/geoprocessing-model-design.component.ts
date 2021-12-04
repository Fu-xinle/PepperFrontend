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
    const stencilNodes2 = [
      { guid: '#', name: '', category: 'ROOT', type: -1, parentGUID: '@' },
      { guid: '870b2476-45ce-4bc1-ae71-720ec29b229f', name: '数据', category: 'DATA', type: 0, parentGUID: '#' },
      {
        guid: 'e8755391-6cff-4666-b2fe-58f2180d5669',
        name: '道路数据',
        category: 'DATA',
        type: 0,
        parentGUID: '870b2476-45ce-4bc1-ae71-720ec29b229f',
      },
      {
        guid: '3c3242d3-c074-4820-ad3f-1724b22e0c27',
        name: '一级公路',
        category: 'DATA',
        type: 1,
        parentGUID: 'e8755391-6cff-4666-b2fe-58f2180d5669',
      },
      {
        guid: 'd37f7759-8ef2-4ae0-b6b2-76f6d74bcbbb',
        name: '农田数据',
        category: 'DATA',
        type: 0,
        parentGUID: '870b2476-45ce-4bc1-ae71-720ec29b229f',
      },
      {
        guid: 'bbed4f9b-3ff1-4b81-990f-c57bc07bce93',
        name: '农田-2018',
        category: 'DATA',
        type: 1,
        parentGUID: 'd37f7759-8ef2-4ae0-b6b2-76f6d74bcbbb',
      },
      {
        guid: 'f5ac9c62-1656-4821-8062-70ad717e73d6',
        name: '农田-2019',
        category: 'DATA',
        type: 1,
        parentGUID: 'd37f7759-8ef2-4ae0-b6b2-76f6d74bcbbb',
      },

      { guid: '97471cc8-e9ea-4068-a530-6a344333c234', name: '算法', category: 'ALGORITHM', type: 0, parentGUID: '#' },
      {
        guid: '7a8077fc-314d-45d6-a4ba-0287834556f8',
        name: '四则运算',
        category: 'ALGORITHM',
        type: 0,
        parentGUID: '97471cc8-e9ea-4068-a530-6a344333c234',
      },
      {
        guid: '5464f6d1-fb1f-48fc-98f8-cd26b71f9f0c',
        name: '加法',
        category: 'ALGORITHM',
        type: 1,
        parentGUID: '7a8077fc-314d-45d6-a4ba-0287834556f8',
      },
      {
        guid: 'df6d101f-2940-4f4a-9d6c-7b13a71adbe3',
        name: '减法',
        category: 'ALGORITHM',
        type: 1,
        parentGUID: '7a8077fc-314d-45d6-a4ba-0287834556f8',
      },
      {
        guid: 'e4d00ba3-03b3-40d0-8b9d-45553d1db7fd',
        name: '乘法',
        category: 'ALGORITHM',
        type: 1,
        parentGUID: '7a8077fc-314d-45d6-a4ba-0287834556f8',
      },
      {
        guid: '1e457f00-66cb-4721-9179-0f29c02641a3',
        name: '空间算法',
        category: 'ALGORITHM',
        type: 0,
        parentGUID: '97471cc8-e9ea-4068-a530-6a344333c234',
      },
      {
        guid: '671f5f8b-cebf-48c5-8140-9bbbf4e0c076',
        name: '求交',
        category: 'ALGORITHM',
        type: 1,
        parentGUID: '1e457f00-66cb-4721-9179-0f29c02641a3',
      },
      {
        guid: '959f2248-a49f-4781-8161-f0098d079b58',
        name: '裁剪',
        category: 'ALGORITHM',
        type: 1,
        parentGUID: '1e457f00-66cb-4721-9179-0f29c02641a3',
      },

      { guid: '99fb71e8-a794-47c2-a9c6-dc0a6e36248f', name: '模型', category: 'MODEL', type: 0, parentGUID: '#' },
      {
        guid: '834629fb-8f77-40c6-9142-65116402f827',
        name: '督察模型',
        category: 'MODEL',
        type: 0,
        parentGUID: '99fb71e8-a794-47c2-a9c6-dc0a6e36248f',
      },
      {
        guid: 'a06f3de5-44f1-46d8-986c-1b72659de1b3',
        name: '督察核查',
        category: 'MODEL',
        type: 1,
        parentGUID: '834629fb-8f77-40c6-9142-65116402f827',
      },
      {
        guid: '359d3243-5a69-498d-b6c8-3ae50865943a',
        name: '督察审核',
        category: 'MODEL',
        type: 1,
        parentGUID: '834629fb-8f77-40c6-9142-65116402f827',
      },
      {
        guid: '6c57d3d6-8c72-4428-a116-4d7693007f00',
        name: '审计模型',
        category: 'MODEL',
        type: 0,
        parentGUID: '99fb71e8-a794-47c2-a9c6-dc0a6e36248f',
      },
      {
        guid: 'a9dd8187-a5b4-4b9b-9ae1-988291b1d16a',
        name: '农田分析',
        category: 'MODEL',
        type: 1,
        parentGUID: '6c57d3d6-8c72-4428-a116-4d7693007f00',
      },
      {
        guid: 'f8094fd5-ef82-4619-a83f-d03f653f2ef9',
        name: '规划模型',
        category: 'MODEL',
        type: 0,
        parentGUID: '99fb71e8-a794-47c2-a9c6-dc0a6e36248f',
      },
      {
        guid: 'af3303c8-7272-450c-9621-40eaa45aafaa',
        name: '农田模型',
        category: 'MODEL',
        type: 0,
        parentGUID: 'f8094fd5-ef82-4619-a83f-d03f653f2ef9',
      },
      {
        guid: '5aadbc65-7d51-4470-ac9d-721355531884',
        name: '土地模型',
        category: 'MODEL',
        type: 0,
        parentGUID: 'f8094fd5-ef82-4619-a83f-d03f653f2ef9',
      },
      {
        guid: 'c6524286-fcea-4ffa-91f5-e0457f6150c9',
        name: '土地求交',
        category: 'MODEL',
        type: 1,
        parentGUID: '5aadbc65-7d51-4470-ac9d-721355531884',
      },
    ];
    loadStencilTreeLayout(this.rappid, stencilNodes2);

    // 设置搜索框的placeholder
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
