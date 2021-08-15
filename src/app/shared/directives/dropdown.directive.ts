import { Directive } from '@angular/core';
import { Router } from '@angular/router';

import { DropdownLinkDirective } from './dropdown-link.directive';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  protected navlinks: DropdownLinkDirective[] = [];

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

  public removeLink(link: DropdownLinkDirective): void {
    const index = this.navlinks.indexOf(link);
    if (index !== -1) {
      this.navlinks.splice(index, 1);
    }
  }
}
