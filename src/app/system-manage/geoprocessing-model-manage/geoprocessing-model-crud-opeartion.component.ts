import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { GeoprocessingModelManageComponent } from './geoprocessing-model-manage.component';

/**
 * ?目前是图标+tooltip的模式，更换为Button
 */
@Component({
  selector: 'app-geoprocessing-model-crud-operation',
  styles: [
    `
      span.datatable-custom-operation {
        vertical-align: -webkit-baseline-middle;
      }
    `,
  ],
  template: `
    <span class="datatable-custom-operation">
      <a href="javascript:void(0)" (click)="editGeoprocessingModel()">
        <i
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="修改地理处理摸型信息"
          class="icon-Eraser-2 text-25 text-info mr-2"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="designGeoprocessingModel()">
        <i
          ngxTippy
          [tippyProps]="{ theme: 'light-border' }"
          data-tippy-content="地理处理摸型设计"
          class="icon-Edit text-25 text-success mr-2"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteGeoprocessingModel()">
        <i
          ngxTippy
          [tippyProps]="{ theme: 'light-border' }"
          data-tippy-content="删除地理处理摸型"
          class="icon-Close-Window text-25 text-danger"
        ></i>
      </a>
    </span>
  `,
})
export class GeoprocessingModelCrudOperationComponent implements AgRendererComponent {
  /**ag-grid表格中操作列单元格单独渲染 */
  public params!: ICellRendererParams;
  public componentParent!: GeoprocessingModelManageComponent;

  constructor(private router: Router) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }

  editGeoprocessingModel() {
    this.componentParent.editGeoprocessingModel(this.params.node);
  }

  designGeoprocessingModel() {
    this.router.navigate(['/full/system-manage/geoprocessing-model-design', { guid: this.params.data.guid }]);
  }

  deleteGeoprocessingModel() {
    this.componentParent.deleteGeoprocessingModel(this.params.node);
  }
}
