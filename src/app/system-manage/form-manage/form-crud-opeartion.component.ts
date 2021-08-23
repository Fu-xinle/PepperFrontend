import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
          class="icon-Eraser-2 text-25 text-info me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="修改表单信息"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="designForm()">
        <i
          class="icon-Edit text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="表单设计"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteForm()">
        <i
          class="icon-Close-Window text-25 text-danger"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="删除表单"
        ></i>
      </a>
    </span>
  `,
})
export class FormCrudOperationComponent implements AgRendererComponent {
  /**ag-grid表格中操作列单元格单独渲染 */
  public params!: ICellRendererParams;
  public componentParent!: FormManageComponent;

  constructor(private router: Router, public activatedRoute: ActivatedRoute) {}

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
    this.router.navigate(['../../system-manage/form-design', { guid: this.params.data.guid }], { relativeTo: this.activatedRoute });
  }

  deleteForm() {
    this.componentParent.deleteForm(this.params.node);
  }
}
