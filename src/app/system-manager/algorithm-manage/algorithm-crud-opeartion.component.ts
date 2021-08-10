import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { AlgorithmManageComponent } from './algorithm-manage.component';

// 目前是图标+tooltip的模式，可以更换为Button更简单
@Component({
  selector: 'app-algorithm-crud-operation',
  styles: [
    `
      span.datatable-custom-operation {
        vertical-align: -webkit-baseline-middle;
      }
    `,
  ],
  template: `
    <span class="datatable-custom-operation">
      <a href="javascript:void(0)" (click)="editAlgorithm()">
        <i
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          data-tippy-content="修改算法信息"
          class="icon-Eraser-2 text-25 text-info mr-2"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="designAlgorithm()">
        <i ngxTippy [tippyProps]="{ theme: 'light-border' }" data-tippy-content="算法设计" class="icon-Edit text-25 text-success mr-2"></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteAlgorithm()">
        <i
          ngxTippy
          [tippyProps]="{ theme: 'light-border' }"
          data-tippy-content="删除算法"
          class="icon-Close-Window text-25 text-danger"
        ></i>
      </a>
    </span>
  `,
})
export class AlgorithmCrudOperationComponent implements AgRendererComponent {
  public params!: ICellRendererParams;
  public componentParent!: AlgorithmManageComponent;

  constructor(private router: Router) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }

  editAlgorithm() {
    this.componentParent.editAlgorithm(this.params.node);
  }

  designAlgorithm() {
    // 路由到算法设计页面
    this.router.navigate(['/full/system-manager/algorithm-design', { guid: this.params.data.guid }]);
  }

  deleteAlgorithm() {
    this.componentParent.deleteAlgorithm(this.params.node);
  }
}
