import { Component, OnInit, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { filter } from 'rxjs/operators';

import { NavigationService, IMenuItem } from '../../services/navigation.service';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChildren(PerfectScrollbarDirective)
  psContainers!: QueryList<PerfectScrollbarDirective>;
  selectedItem!: IMenuItem;
  nav!: IMenuItem[];
  psContainerSecSidebar!: PerfectScrollbarDirective;

  constructor(public router: Router, public navService: NavigationService) {
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: MouseEvent) {
    this.updateSidebar();
  }

  ngOnInit() {
    this.updateSidebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(_routeChange => {
      this.closeChildNav();
      if (Utils.isMobile()) {
        this.navService.sidebarState.sidenavOpen = false;
      }
    });

    this.navService.menuItems$.subscribe(items => {
      this.nav = items;
      this.setActiveFlag();
    });
  }

  selectItem(item: any) {
    this.navService.sidebarState.childnavOpen = true;
    this.navService.selectedItem = item;
    this.setActiveMainItem(item);

    // Scroll to top secondary sidebar
    setTimeout(() => {
      this.psContainerSecSidebar.update();
      this.psContainerSecSidebar.scrollToTop(0, 400);
    });
  }
  closeChildNav() {
    this.navService.sidebarState.childnavOpen = false;
    this.setActiveFlag();
  }

  onClickChangeActiveFlag(item: any) {
    this.setActiveMainItem(item);
  }
  setActiveMainItem(item: any) {
    this.nav.forEach(i => {
      i.active = false;
    });
    item.active = true;
  }

  setActiveFlag() {
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

  updateSidebar() {
    if (Utils.isMobile()) {
      this.navService.sidebarState.sidenavOpen = false;
      this.navService.sidebarState.childnavOpen = false;
    } else {
      this.navService.sidebarState.sidenavOpen = true;
    }
  }
}
