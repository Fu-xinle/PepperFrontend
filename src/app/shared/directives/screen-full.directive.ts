import { Directive, HostListener } from '@angular/core';

import * as screenfull from 'screenfull';

@Directive({
  selector: '[appScreenFull]',
})
export class ScreenFullDirective {
  @HostListener('click', ['$event'])
  onClick() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}
