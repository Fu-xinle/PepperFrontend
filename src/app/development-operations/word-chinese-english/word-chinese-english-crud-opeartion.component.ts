import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { WordChineseEnglishComponent } from './word-chinese-english.component';

/**
 * ?目前是图标+tooltip的模式，更换为Button,Button存在位置不正确问题
 */
@Component({
  selector: 'app-word-chinese-english-crud-operation',
  styles: [
    `
      span.datatable-custom-operation {
        vertical-align: -webkit-baseline-middle;
      }
    `,
  ],
  template: `
    <span class="datatable-custom-operation">
      <a href="javascript:void(0)" (click)="createWordChineseEnglish()" *ngIf="!params.data.isLeaf">
        <i
          class="icon-Add text-25 text-success me-2"
          ngxTippy
          [tippyProps]="{ theme: 'light-border', hideOnClick: true }"
          [tippyName]="params.value + '-create'"
          data-tippy-content="添加词汇或词汇类别"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="editWordChineseEnglish()">
        <i
          class="icon-Pencil text-25 text-info me-2"
          ngxTippy
          [tippyProps]="{
            theme: 'light-border',
            hideOnClick: true,
            content: params.data.isLeaf ? '修改词汇信息' : '修改词汇类别信息'
          }"
          [tippyName]="params.value + '-modify'"
        ></i>
      </a>
      <a href="javascript:void(0)" (click)="deleteWordChineseEnglish()">
        <i
          class="icon-Close-Window text-25 text-danger"
          ngxTippy
          [tippyProps]="{
            theme: 'light-border',
            hideOnClick: true,
            content: params.data.isLeaf ? '删除词汇项' : '删除词汇项类别'
          }"
          [tippyName]="params.value + '-delete'"
        ></i>
      </a>
    </span>
  `,
})
export class WordChineseEnglishCrudOperationComponent implements AgRendererComponent {
  /**ag-grid表格中操作列单元格单独渲染 */
  public params!: ICellRendererParams;
  public componentParent!: WordChineseEnglishComponent;

  constructor(private router: Router, public activatedRoute: ActivatedRoute) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }

  createWordChineseEnglish() {
    this.componentParent.createWordChineseEnglish(this.params.node);
  }

  editWordChineseEnglish() {
    this.componentParent.editWordChineseEnglish(this.params.node);
  }

  deleteWordChineseEnglish() {
    this.componentParent.deleteWordChineseEnglish(this.params.node);
  }
}
