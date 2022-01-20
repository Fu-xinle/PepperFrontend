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
      description: '网站主页',
      type: 'dropDown',
      icon: 'icon-Home',
      sub: [
        { icon: 'icon-Home-3', name: '主页', state: '/development/home', type: 'link' },
        {
          icon: 'icon-Bar-Chart',
          name: 'BI主页',
          state: '/development/home/home-bi',
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
          icon: 'icon-Wacom-Tablet',
          name: '工作流管理',
          state: '/development/system-manage/workflow-manage',
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
      name: '技术研究',
      description: 'Web相关的技术',
      type: 'dropDown',
      icon: 'icon-Device-SyncwithCloud',
      sub: [
        {
          icon: 'icon-Map2',
          name: 'Leaflet地图',
          state: '/development/technology-research/leaflet-map',
          type: 'link',
        },
        {
          icon: ' icon-Map-Marker2',
          name: 'ArcGIS地图',
          state: '/development/technology-research/arcgis-map',
          type: 'link',
        },
        {
          icon: 'icon-Globe',
          name: '三维地图',
          state: '/development/technology-research/cesium-earth',
          type: 'link',
        },
        {
          icon: 'icon-Gemini',
          name: 'CSS揭秘',
          state: '/development/technology-research/css-secrets',
          type: 'link',
        },
        {
          icon: 'icon-Bug',
          name: '爬虫',
          state: '/development/technology-research/web-crawler',
          type: 'link',
        },
        {
          icon: 'icon-Speach-Bubbles',
          name: 'chat聊天',
          state: '/development/technology-research/chat',
          type: 'link',
        },
        {
          icon: 'icon-File-Search',
          name: '相关性搜索',
          state: '/development/technology-research/relevance-search',
          type: 'link',
        },
        {
          icon: 'icon-Cloud-Picture',
          name: 'COG技术',
          state: '/development/technology-research/cloud-optimized-geotiff',
          type: 'link',
        },
      ],
    },
    {
      name: '开发运维',
      description: '开发运维一体化工具',
      type: 'dropDown',
      icon: 'icon-Affiliate',
      sub: [
        {
          icon: 'icon-Calendar-4',
          name: 'KanBan任务',
          state: '/development/development-operations/kan-ban',
          type: 'link',
        },
        {
          icon: 'icon-A-Z',
          name: '词汇表',
          state: '/development/development-operations/word-chinese-english',
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
