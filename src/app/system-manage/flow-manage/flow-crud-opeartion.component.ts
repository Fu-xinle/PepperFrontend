import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { FlowManageComponent } from './flow-manage.component';

/**
 * ?目前是图标+tooltip的模式，更换为Button
 */
@Component({
  selector: 'app-flow-crud-operation',
  styles: [
    `
      span.datatable-custom-operation {
        vertical-align: -webkit-baseline-middle;
      }
    `,
  ],
  template: `
    <span class="datatable-custom-operation">
      <a href="javascript:void(0)" (click)="editFlow()">
        <i
          class="icon-Eraser-2 text-25 text-info me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="修改流程信息"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="designFlow()">
        <i
          class="icon-Edit text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="流程图设计"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteFlow()">
        <i
          class="icon-Close-Window text-25 text-danger"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="删除流程"
        ></i>
      </a>
    </span>
  `,
})
export class FlowCrudOperationComponent implements AgRendererComponent {
  /**ag-grid表格中操作列单元格单独渲染 */
  public params!: ICellRendererParams;
  public componentParent!: FlowManageComponent;

  constructor(private router: Router, public activatedRoute: ActivatedRoute) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.componentParent = params.context.componentParent;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }

  editFlow() {
    this.componentParent.editFlow(this.params.node);
  }

  designFlow() {
    this.router.navigate(['../../system-manage/flow-design', { guid: this.params.data.guid }], { relativeTo: this.activatedRoute });
  }

  deleteFlow() {
    this.componentParent.deleteFlow(this.params.node);
  }
}
