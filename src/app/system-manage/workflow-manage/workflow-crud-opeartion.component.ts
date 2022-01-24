import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { WorkflowManageComponent } from './workflow-manage.component';

/**
 * ?目前是图标+tooltip的模式，更换为Button,Button存在位置不正确问题
 */
@Component({
  selector: 'app-workflow-crud-operation',
  styles: [
    `
      span.datatable-custom-operation {
        vertical-align: -webkit-baseline-middle;
      }
    `,
  ],
  template: `
    <span class="datatable-custom-operation">
      <a href="javascript:void(0)" (click)="createWorkflow()" *ngIf="!params.data.isLeaf">
        <i
          class="icon-Add text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          [tippyName]="params.value + '-create'"
          data-tippy-content="添加业务工作流或业务工作流类别"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="editWorkflow()">
        <i
          class="icon-Pencil text-25 text-info me-2"
          ngxTippy
          [tippyProps]="{
            theme: 'light-border',
            hideOnClick: true,
            content: params.data.isLeaf ? '修改业务工作流信息' : '修改业务工作流类别信息'
          }"
          [tippyName]="params.value + '-modify'"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteWorkflow()">
        <i
          class="icon-Close-Window text-25 text-danger"
          ngxTippy
          [tippyProps]="{
            theme: 'light-border',
            hideOnClick: true,
            content: params.data.isLeaf ? '删除业务工作流' : '删除业务工作流类别'
          }"
          [tippyName]="params.value + '-delete'"
        ></i>
      </a>
    </span>
  `,
})
export class WorkflowCrudOperationComponent implements AgRendererComponent {
  /**ag-grid表格中操作列单元格单独渲染 */
  public params!: ICellRendererParams;
  public componentParent!: WorkflowManageComponent;

  constructor(private router: Router, public activatedRoute: ActivatedRoute) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }

  createWorkflow() {
    this.componentParent.createWorkflow(this.params.node);
  }

  editWorkflow() {
    this.componentParent.editWorkflow(this.params.node);
  }

  deleteWorkflow() {
    this.componentParent.deleteWorkflow(this.params.node);
  }
}
