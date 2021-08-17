import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Subject, takeUntil } from 'rxjs';
import { SearchService } from 'src/app/shared/services/search.service';

import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarDirective, { static: true })
  public perfectScrollbar!: PerfectScrollbarDirective;

  public moduleLoading: boolean = false;
  public customizerShow: boolean = true;

  private ngUnsubscribe = new Subject<boolean>();

  constructor(public navService: NavigationService, public searchService: SearchService, private router: Router) {}

  ngOnInit() {
    /**事件的顺序:NavigationStart-> ... ->NavigationEnd */
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.moduleLoading = true;
      }
      if (event instanceof NavigationEnd) {
        this.customizerShow = (event as NavigationEnd).urlAfterRedirects.split('/').pop() === 'home';
        this.moduleLoading = false;
        /** 路由至新页面诗，更新滚动条 */
        this.perfectScrollbar.update();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
