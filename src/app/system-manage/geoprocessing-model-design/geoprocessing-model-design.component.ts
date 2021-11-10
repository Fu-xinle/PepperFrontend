import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';

import exampleGraphJSON from '../../../assets/non-npm/angular-rappid/config/example-graph.json';
import { STENCIL_WIDTH } from '../../../assets/non-npm/angular-rappid/config/theme';
import { loadStencilShapes, importGraphFromJSON, zoomToFit } from '../../../assets/non-npm/angular-rappid/rappid/actions';
import { EventBusService } from '../../../assets/non-npm/angular-rappid/services/event-bus.service';
import RappidService from '../../../assets/non-npm/angular-rappid/services/rappid.service';

@Component({
  selector: 'app-geoprocessing-model-design',
  templateUrl: './geoprocessing-model-design.component.html',
  styleUrls: ['./geoprocessing-model-design.component.scss'],
  host: { class: 'rappid-scope shadow' },
  encapsulation: ViewEncapsulation.None,
})
export class GeoprocessingModelDesignComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paper') paper!: ElementRef;
  @ViewChild('stencil') stencil!: ElementRef;
  @ViewChild('toolbar') toolbar!: ElementRef;

  public rappid!: RappidService;
  public fileJSON!: Object;

  private subscriptions = new Subscription();

  constructor(
    private element: ElementRef,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    const { element, paper, stencil, toolbar, eventBusService, cdr } = this;
    this.rappid = new RappidService(
      element.nativeElement,
      paper.nativeElement,
      stencil.nativeElement,
      toolbar.nativeElement,
      eventBusService,
      {
        'stencil-group': null,
        'inject-scope': this,
        'toolbar-name': 'flow',
        'toolbar-save': null,
        'toolbar-debug': null,
        'toolbar-set-property': null,
      }
    );
    this.setStencilContainerSize();
    this.onStart();
    cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    // this.subscriptions.unsubscribe();
    this.rappid.destroy();
  }

  public openFile(json: Object): void {
    const { rappid } = this;
    this.fileJSON = json;
    importGraphFromJSON(rappid, json);
    zoomToFit(rappid);
  }

  private onStart(): void {
    const { rappid } = this;
    loadStencilShapes(rappid);
    this.openFile(exampleGraphJSON);
  }

  private setStencilContainerSize(): void {
    const { renderer, stencil } = this;
    renderer.setStyle(stencil.nativeElement, 'width', `${STENCIL_WIDTH}px`);
    this.onStencilToggle();
  }

  private onStencilToggle(): void {
    const { rappid } = this;
    const { scroller, stencil } = rappid;
    if (true) {
      stencil.unfreeze();
      scroller.el.scrollLeft += STENCIL_WIDTH;
    } else {
      stencil.freeze();
      scroller.el.scrollLeft -= STENCIL_WIDTH;
    }
  }
}
