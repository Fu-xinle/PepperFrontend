import { Directive, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DropdownLinkDirective } from './dropdown-link.directive';

@Directive({
  selector: '[appDropdown]',
})
export class AppDropdownDirective implements OnInit {
  protected navlinks: DropdownLinkDirective[] = [];

  private _router!: Subscription;

  constructor(private router: Router) {}

  public closeOtherLinks(openLink: DropdownLinkDirective): void {
    this.navlinks.forEach((link: DropdownLinkDirective) => {
      if (link !== openLink) {
        link.open = false;
      }
    });
  }

  public addLink(link: DropdownLinkDirective): void {
    this.navlinks.push(link);
  }

  public removeGroup(link: DropdownLinkDirective): void {
    const index = this.navlinks.indexOf(link);
    if (index !== -1) {
      this.navlinks.splice(index, 1);
    }
  }

  public getUrl() {
    return this.router.url;
  }

  public ngOnInit(): any {
    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(_event => {
      this.navlinks.forEach((link: DropdownLinkDirective) => {
        if (link.group) {
          const routeUrl = this.getUrl();
          const currentUrl = routeUrl.split('/');
          if (currentUrl.indexOf(link.group) > 0) {
            link.open = true;
            this.closeOtherLinks(link);
          }
        }
      });
    });
  }
}
