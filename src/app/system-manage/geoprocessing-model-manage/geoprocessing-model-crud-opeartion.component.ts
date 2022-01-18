import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { GeoprocessingModelManageComponent } from './geoprocessing-model-manage.component';

/**
 * ?目前是图标+tooltip的模式，更换为Button,Button存在位置不正确问题
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
      <a href="javascript:void(0)" (click)="createGeoprocessingModel()" *ngIf="!params.data.is_leaf">
        <i
          class="icon-Add text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          [tippyName]="params.value + '-create'"
          data-tippy-content="添加地理处理摸型或类别"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="designGeoprocessingModel()" *ngIf="params.data.is_leaf">
        <i
          class="icon-Network-Window text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          [tippyName]="params.value + '-design'"
          data-tippy-content="地理处理摸型设计"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="editGeoprocessingModel()">
        <i
          class="icon-Pencil text-25 text-info me-2"
          ngxTippy
          [tippyProps]="{
            theme: 'light-border',
            hideOnClick: true,
            content: params.data.is_leaf ? '修改地理处理摸型信息' : '修改地理处理摸型类别信息'
          }"
          [tippyName]="params.value + '-modify'"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteGeoprocessingModel()">
        <i
          class="icon-Close-Window text-25 text-danger"
          ngxTippy
          [tippyProps]="{
            theme: 'light-border',
            hideOnClick: true,
            content: params.data.is_leaf ? '删除地理处理摸型' : '删除地理处理摸型类别'
          }"
          [tippyName]="params.value + '-delete'"
        ></i>
      </a>
    </span>
  `,
})
export class GeoprocessingModelCrudOperationComponent implements AgRendererComponent {
  /**ag-grid表格中操作列单元格单独渲染 */
  public params!: ICellRendererParams;
  public componentParent!: GeoprocessingModelManageComponent;

  constructor(private router: Router, public activatedRoute: ActivatedRoute) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }

  createGeoprocessingModel() {
    this.componentParent.createGeoprocessingModel(this.params.node);
  }

  editGeoprocessingModel() {
    this.componentParent.editGeoprocessingModel(this.params.node);
  }

  designGeoprocessingModel() {
    this.router.navigate(['../../system-manage/geoprocessing-model-design', { guid: this.params.data.guid }], {
      relativeTo: this.activatedRoute,
    });
  }

  deleteGeoprocessingModel() {
    this.componentParent.deleteGeoprocessingModel(this.params.node);
  }
}
