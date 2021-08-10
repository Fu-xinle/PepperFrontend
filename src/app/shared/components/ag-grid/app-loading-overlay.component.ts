import { Component } from '@angular/core';

import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-loading-overlay',
  template: `<div class="ag-overlay-loading-center" style="min-width: 150px;text-align: left;">
    <img [src]="'assets/images/loading/loading.gif'" style="width: 32px;" alt="" />
    {{ params.loadingMessage }}
  </div>`,
})
export class AppLoadingOverlayComponent implements ILoadingOverlayAngularComp {
  public params!: ILoadingOverlayParams & { loadingMessage: string };

  agInit(params: ILoadingOverlayParams & { loadingMessage: string }): void {
    this.params = params;
  }
}
