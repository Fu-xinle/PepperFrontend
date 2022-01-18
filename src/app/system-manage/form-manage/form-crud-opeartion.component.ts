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
      <a href="javascript:void(0)" (click)="createForm()" *ngIf="!params.data.is_leaf">
        <i
          class="icon-Add text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          [tippyName]="params.value + '-create'"
          data-tippy-content="添加表单或表单类别"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="designForm()" *ngIf="params.data.is_leaf">
        <i
          class="icon-Network-Window text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          [tippyName]="params.value + '-design'"
          data-tippy-content="表单设计"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="editForm()">
        <i
          class="icon-Pencil text-25 text-info me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true, content: params.data.is_leaf ? '修改表单信息' : '修改表单类别信息' }"
          [tippyName]="params.value + '-modify'"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteForm()">
        <i
          class="icon-Close-Window text-25 text-danger"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true, content: params.data.is_leaf ? '删除表单' : '删除表单类别' }"
          [tippyName]="params.value + '-delete'"
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

  createForm() {
    this.componentParent.createForm(this.params.node);
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
