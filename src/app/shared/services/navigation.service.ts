import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { IMenuItem, ISidebarState } from '../interface/shared-layout.interface';
import { LocalStoreUtils } from '../utils/local-store.utils';
@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnDestroy {
  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false,
  };
  public selectedItem!: IMenuItem;

  /** 预设值各系统路由菜单 */
  public developmentMenu: IMenuItem[] = [
    {
      name: '主页',
      description: '网站主页.',
      type: 'dropDown',
      icon: 'icon-Home',
      sub: [
        { icon: 'icon-Home-3', name: '主页', state: '/development/home', type: 'link' },
        {
          icon: 'icon-Map2',
          name: 'Map主页',
          state: '/development/home/home-map',
          type: 'link',
        },
        {
          icon: 'icon-Globe',
          name: 'Earth主页',
          state: '/development/home/home-earth',
          type: 'link',
        },
        {
          icon: 'icon-Bar-Chart',
          name: 'BI主页',
          state: '/development/home/home-bi',
          type: 'link',
        },
        {
          icon: 'icon-Speach-Bubbles',
          name: 'chat主页',
          state: '/development/home/home-chat',
          type: 'link',
        },
      ],
    },
    {
      name: '系统管理',
      description: '系统管理',
      type: 'dropDown',
      icon: 'icon-Data-Settings',
      sub: [
        {
          icon: 'icon-Key',
          name: '用户-角色-权限',
          state: '/development/system-manage/authorize',
          type: 'link',
        },
        {
          icon: 'icon-ID-Card',
          name: '用户信息',
          state: '/development/system-manage/user-info',
          type: 'link',
        },
        {
          icon: 'icon-File-Refresh',
          name: '用户日志',
          state: '/development/system-manage/user-log',
          type: 'link',
        },
        {
          icon: 'icon-Speach-BubbleComic2',
          name: '地理处理模型',
          state: '/development/system-manage/geoprocessing-model-manage',
          type: 'link',
        },
        {
          icon: 'icon-Network-Window',
          name: '流程管理',
          state: '/development/system-manage/flow-manage',
          type: 'link',
        },
        {
          icon: 'icon-Notepad',
          name: '表单管理',
          state: '/development/system-manage/form-manage',
          type: 'link',
        },
      ],
    },
    {
      name: '大数据',
      description: '大数据算法、空间分析算法.',
      type: 'dropDown',
      icon: 'icon-Big-Data',
      sub: [
        {
          icon: 'icon-Geo2-plus',
          name: '空间分析',
          state: '/development/technology-research/spatial-analysis',
          type: 'link',
        },
        {
          icon: 'icon-File-Search',
          name: '全文检索',
          state: '/development/technology-research/relevance-search',
          type: 'link',
        },
        {
          icon: 'icon-Brain-3',
          name: '数据挖掘',
          state: '/development/technology-research/data-mining',
          type: 'link',
        },
        {
          icon: 'icon-Bug',
          name: '爬虫',
          state: '/development/technology-research/web-crawler',
          type: 'link',
        },
      ],
    },
  ];

  public productOAMenu: IMenuItem[] = [];

  public supervisionMenu: IMenuItem[] = [];

  public deepLearningMenu: IMenuItem[] = [];

  public portalMenu: IMenuItem[] = [];

  public auditMenu: IMenuItem[] = [];

  public spatialPlanningMenu: IMenuItem[] = [];

  /**利用Observable,在其它组件动态切换不同的导航栏 */
  public menuItems = new BehaviorSubject<IMenuItem[]>([]);
  public menuItems$ = this.menuItems.asObservable();

  constructor() {}

  /**
   *不同平台使用不同的主题,切换平台类型,依据用户权限过滤显示的导航菜单
   *
   * @param {string} platformType  Parameter 平台类型名称
   */
  publishNavigationChange(platformType: string) {
    platformType = platformType ? platformType : 'development';
    switch (platformType) {
      case 'development':
        this.menuItems.next(this.developmentMenu);
        break;
      case 'productOA':
        this.menuItems.next(this.productOAMenu);
        break;
      case 'supervision':
        this.menuItems.next(this.supervisionMenu);
        break;
      case 'deep-learning':
        this.menuItems.next(this.deepLearningMenu);
        break;
      case 'audit':
        this.menuItems.next(this.auditMenu);
        break;
      case 'spatial-planning':
        this.menuItems.next(this.spatialPlanningMenu);
        break;
      case 'portal':
        this.menuItems.next(this.portalMenu);
        break;
      default:
        this.menuItems.next(this.developmentMenu);
    }
    LocalStoreUtils.setItem('layout', platformType);
    /** //!依据用户权限过滤显示的导航菜单 预留 */
  }

  ngOnDestroy() {
    this.menuItems.complete();
  }
}
