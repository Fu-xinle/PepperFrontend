import { Directive, ElementRef, HostListener, Input, OnInit, Inject } from '@angular/core';

import { SidebarHelperService } from '../services/sidebar-helper.service';
import { GeneralUtils } from '../utils/general.utils';

@Directive({
  selector: '[appSidebarContainer]',
})
export class SidebarContainerDirective {
  @Input('appSidebarContainer') id: string = '';
  public nativeEl: any;
  public content!: SidebarContentDirective;

  constructor(public el: ElementRef, private _sidenavHelperService: SidebarHelperService) {
    this.nativeEl = this.el.nativeElement;
    this.nativeEl.className += ' sidebar-container';
  }
}

@Directive({
  selector: '[appSidebarContent]',
})
export class SidebarContentDirective {
  @Input('appSidebarContent') id: string = '';
  public nativeEl: any;

  constructor(
    public el: ElementRef,
    private _sidenavHelperService: SidebarHelperService,
    @Inject(SidebarContainerDirective)
    public container: SidebarContainerDirective
  ) {
    this.nativeEl = this.el.nativeElement;
    this.container.content = this;
    this.nativeEl.className += ' sidebar-content';
  }

  createBackdrop() {}
}

@Directive({
  selector: '[appSidebar]',
})
export class SidebarDirective implements OnInit {
  @Input() public align: 'left' | 'right' = 'left';
  @Input() public mode: 'over' | 'side' = 'side';
  @Input('appSidebar') id: string = '';
  @Input() closed: boolean = false;

  public width: string = '';
  public nativeEl: any;
  public containerNativeEl: any;
  public contentNativeEl: any;

  constructor(
    private el: ElementRef,
    private _sidenavHelperService: SidebarHelperService,
    @Inject(SidebarContainerDirective)
    public container: SidebarContainerDirective
  ) {
    this.nativeEl = this.el.nativeElement;
    this.containerNativeEl = this.container.el.nativeElement;
    this.contentNativeEl = this.container.content.el.nativeElement;
    this.nativeEl.className += ' sidebar';
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: MouseEvent) {
    this.initSidebar();
  }

  ngOnInit() {
    this.width = `${this.el.nativeElement.offsetWidth}px`;
    this._sidenavHelperService.setSidenav(this.id, this);
    this.initSidebar();
  }

  open() {
    if (this.align === 'left') {
      this.nativeEl.style.left = 0;
      if (!GeneralUtils.isMobile()) {
        this.contentNativeEl.style.marginLeft = this.width;
      }
    } else if (this.align === 'right') {
      this.nativeEl.style.right = 0;
      if (!GeneralUtils.isMobile()) {
        this.contentNativeEl.style.marginRight = this.width;
      }
    }
    this.closed = false;
  }

  close() {
    if (this.align === 'left') {
      this.nativeEl.style.left = `-${this.width}`;
      this.contentNativeEl.style.marginLeft = 0;
    } else if (this.align === 'right') {
      this.nativeEl.style.right = `-${this.width}`;
      this.contentNativeEl.style.marginRight = 0;
    }
    this.closed = true;
  }

  toggle() {
    if (this.closed) {
      this.open();
    } else {
      this.close();
    }
  }

  private initSidebar() {
    this.closed = GeneralUtils.isMobile();
    if (this.closed) {
      this.close();
    } else {
      this.open();
    }
  }
}

@Directive({
  selector: '[appSidebarToggler]',
})
export class SidebarTogglerDirective {
  @Input('appSidebarToggler') id: string = '';

  constructor(private _sidenavHelperService: SidebarHelperService) {}

  @HostListener('click')
  onClick() {
    this._sidenavHelperService.getSidenav(this.id).toggle();
  }
}
