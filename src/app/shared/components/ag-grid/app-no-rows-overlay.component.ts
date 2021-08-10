import { Component } from '@angular/core';

import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-no-rows-overlay',
  template: `<div style="">
    <i class="icon-Data-Block display-4 text-primary"></i>
    <p class="mt-2">{{ params.noRowsMessageFunc() }}</p>
  </div>`,
})
export class AppNorowsOverlayComponent implements INoRowsOverlayAngularComp {
  public params!: INoRowsOverlayParams & { noRowsMessageFunc: () => string };

  agInit(params: INoRowsOverlayParams & { noRowsMessageFunc: () => string }): void {
    this.params = params;
  }
}
