import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { FormManageComponent } from './form-manage.component';

/**
 * ?目前是图标+tooltip的模式，更换为Button
 */
@Component({
  selector: 'app-form-crud-operation',
  styles: [
    `
      span.datatable-custom-operation {
        vertical-align: -webkit-baseline-middle;
      }
    `,
  ],
  template: `
    <span class="datatable-custom-operation">
      <a href="javascript:void(0)" (click)="editForm()">
        <i
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="修改表单信息"
          class="icon-Eraser-2 text-25 text-info mr-2"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="designForm()">
        <i ngxTippy [tippyProps]="{ theme: 'light-border' }" data-tippy-content="表单设计" class="icon-Edit text-25 text-success mr-2"></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteForm()">
        <i
          ngxTippy
          [tippyProps]="{ theme: 'light-border' }"
          data-tippy-content="删除表单"
          class="icon-Close-Window text-25 text-danger"
        ></i>
      </a>
    </span>
  `,
})
export class FormCrudOperationComponent implements AgRendererComponent {
  /**ag-grid表格中操作列单元格单独渲染 */
  public params!: ICellRendererParams;
  public componentParent!: FormManageComponent;

  constructor(private router: Router) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.componentParent = params.context.componentParent;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }

  editForm() {
    this.componentParent.editForm(this.params.node);
  }

  designForm() {
    this.router.navigate(['/full/system-manage/form-design', { guid: this.params.data.guid }]);
  }

  deleteForm() {
    this.componentParent.deleteForm(this.params.node);
  }
}
