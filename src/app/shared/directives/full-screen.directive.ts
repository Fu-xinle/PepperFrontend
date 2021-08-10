import { Directive, HostListener } from '@angular/core';

import * as screenfull from 'screenfull';

@Directive({
  selector: '[appFullScreenWindow]',
})
export class FullScreenWindowDirective {
  @HostListener('click', ['$event'])
  onClick() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
      console.info(11);
    }
  }
}
