import { Directive, Input, HostListener } from '@angular/core';

@Directive({ selector: '[appScrollTo]' })
export class ScrollToDirective {
  @Input('scrollTo') elementID: string = '';

  constructor() {}

  @HostListener('click', ['$event'])
  smoothScroll() {
    if (!this.elementID) {
      return;
    }
    const startY = this.currentYPosition();
    const stopY = this.elementYPosition(this.elementID);
    const distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      scrollTo(0, stopY);
      return;
    }
    let speed = Math.round(distance / 50);
    if (speed >= 20) {
      speed = 20;
    }
    const step = Math.round(distance / 25);
    let leapY = stopY > startY ? startY + step : startY - step;
    let timer = 0;
    if (stopY > startY) {
      for (let i = startY; i < stopY; i += step) {
        setTimeout(`window.scrollTo(0, ${leapY})`, timer * speed);
        leapY += step;
        if (leapY > stopY) {
          leapY = stopY;
        }
        timer++;
      }
      return;
    }
    for (let i = startY; i > stopY; i -= step) {
      setTimeout(`window.scrollTo(0, ${leapY})`, timer * speed);
      leapY -= step;
      if (leapY < stopY) {
        leapY = stopY;
      }
      timer++;
    }
    return false;
  }

  currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) {
      return self.pageYOffset;
    }
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    }
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) {
      return document.body.scrollTop;
    }
    return 0;
  }

  elementYPosition(elementID: string) {
    const element = document.getElementById(elementID)!;
    let y = element.offsetTop;
    let node: HTMLElement = element;
    while (node.offsetParent && node.offsetParent !== document.body) {
      node = node.offsetParent as HTMLElement;
      y += node.offsetTop;
    }
    return y;
  }
}
