import { Component, OnInit, HostListener, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { filter, Subject, takeUntil } from 'rxjs';

import { IMenuItem } from '../../interface/shared-layout.interface';
import { NavigationService } from '../../services/navigation.service';
import { GeneralUtils } from '../../utils/general.utils';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  /** 主sidebar、二级sidebar滚动条 */
  @ViewChildren(PerfectScrollbarDirective)
  public psContainers!: QueryList<PerfectScrollbarDirective>;
  public psContainerSecSidebar!: PerfectScrollbarDirective;

  /** sidebar数据以及 主sidebar为dropdown时,当前选择的主sidebar菜单项  */
  public selectedItem!: IMenuItem;
  public nav!: IMenuItem[];

  /** 主sidebar宽度与header高度 */
  public sidebarWidth!: number;
  public headerHeight!: number;

  private ngUnsubscribe = new Subject<boolean>();

  constructor(public router: Router, public navService: NavigationService) {
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: MouseEvent) {
    this.initSidebarState();
  }

  ngOnInit() {
    this.initSidebarState();

    /** 获取sidebar数据,当前路由对应的主sidebar、二级sidebar菜单项标记为avtive状态 */
    this.navService.menuItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(items => {
      this.nav = items;
      this.setCurrentRouteActiveFlag();
    });

    /** 路由到新页面时,关闭二级sidebar */
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(_routeChange => {
        this.setCurrentRouteActiveFlag();
        if (GeneralUtils.isMobile()) {
          this.navService.sidebarState.sidenavOpen = false;
        }
      });
  }

  /**
   * 主sidebar中dropDown菜单，mouseenter事件选中当前菜单项
   *
   * @param {item} item Parameter IMenuItem菜单项
   */
  selectItem(item: IMenuItem) {
    this.navService.sidebarState.childnavOpen = true;
    this.navService.selectedItem = item;

    /** 次sidebar滚动条滚动到顶部 */
    setTimeout(() => {
      this.psContainerSecSidebar.update();
      this.psContainerSecSidebar.scrollToTop(0, 400);
    });
  }

  /**
   *关闭二级sidebar
   */
  closeChildNav() {
    this.navService.sidebarState.childnavOpen = false;
  }

  /**
   *展开二级sidebar
   */
  openChildNav() {
    this.navService.sidebarState.childnavOpen = false;
  }

  /**
   * 将item对应的主sidebar项设置为active
   *
   * @param {item} item Parameter IMenuItem菜单项
   */
  setActiveMainItem(item: IMenuItem) {
    this.nav.forEach(i => {
      i.active = false;
    });
    item.active = true;
  }

  /**
   * 将当前路由对应的主sidebar、二级sidebar菜单项标记为avtive状态
   */
  setCurrentRouteActiveFlag() {
    this.closeChildNav();

    if (window && window.location) {
      const activeRoute = window.location.hash || window.location.pathname;
      this.nav.forEach(item => {
        item.active = false;
        if (activeRoute.indexOf(item.state!) !== -1) {
          this.navService.selectedItem = item;
          item.active = true;
        }
        if (item.sub) {
          item.sub.forEach(subItem => {
            subItem.active = false;
            if (activeRoute.indexOf(subItem.state!) !== -1) {
              this.navService.selectedItem = item;
              item.active = true;
            }
            if (subItem.sub) {
              subItem.sub.forEach(subChildItem => {
                if (activeRoute.indexOf(subChildItem.state!) !== -1) {
                  this.navService.selectedItem = item;
                  item.active = true;
                  subItem.active = true;
                }
              });
            }
          });
        }
      });
    }
  }

  /**
   * mouseLeave事件,移动到header、content、UL
   *
   * @param {elementType} elementType Parameter 元素类型:主sidebar Or 二级sidebar
   * @param {MouseEvent} event Parameter mouseLeave事件对象
   */
  mouseLeaveIMenuItem(elementType: string, event: MouseEvent) {
    const eventAny = event as any;
    if (eventAny.toElement === null) {
      this.setCurrentRouteActiveFlag();
    } else {
      if (
        elementType === 'sidebar' &&
        (eventAny.clientY <= this.headerHeight ||
          (!this.navService.sidebarState.childnavOpen && eventAny.clientX >= this.sidebarWidth) ||
          eventAny.toElement.className.includes('navigation-left'))
      ) {
        this.setCurrentRouteActiveFlag();
      } else if (elementType === 'sidebar-secondary' && eventAny.clientY <= this.headerHeight) {
        this.setCurrentRouteActiveFlag();
      }
    }
  }

  /**
   * sidebar 状态初始化,默认：主sidebar打开(手机窄屏幕关闭);二级sidebar关闭
   */
  initSidebarState() {
    if (GeneralUtils.isMobile()) {
      this.navService.sidebarState.sidenavOpen = false;
      this.navService.sidebarState.childnavOpen = false;
    } else {
      this.navService.sidebarState.sidenavOpen = true;
      this.navService.sidebarState.childnavOpen = false;
    }

    this.sidebarWidth = $('.sidebar-left').eq(0).width()!;
    this.headerHeight = $('.main-header').eq(0).height()!;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
