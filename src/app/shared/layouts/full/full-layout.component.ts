import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouteConfigLoadStart, ResolveEnd } from '@angular/router';

import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { SearchService } from 'src/app/shared/services/search.service';

import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
})
export class FullLayoutComponent implements OnInit {
  @ViewChild(PerfectScrollbarDirective, { static: true })
  public perfectScrollbar!: PerfectScrollbarDirective;

  public moduleLoading: boolean = false;

  constructor(public navService: NavigationService, public searchService: SearchService, private router: Router) {}

  ngOnInit() {
    /**事件的顺序:RouteConfigLoadStart->RouteConfigLoadEnd->ResolveStart->ResolveEnd */
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.moduleLoading = true;
      }
      if (event instanceof ResolveEnd) {
        this.moduleLoading = false;
      }
    });
  }
}
