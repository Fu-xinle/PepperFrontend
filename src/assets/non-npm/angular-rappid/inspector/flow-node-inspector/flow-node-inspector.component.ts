import { Component, Input } from '@angular/core';
import { shapes } from '@clientio/rappid';

import { BaseInspectorComponent } from '../base-inspector/base-inspector.component';

interface InspectorPort {
  id: string;
  label: string;
}

@Component({
  selector: 'app-flow-node-inspector',
  templateUrl: './flow-node-inspector.component.html',
  styleUrls: ['../inspector.component.scss'],
})
export class FlowNodeInspectorComponent extends BaseInspectorComponent {
  @Input() cell!: shapes.app.FlowNode;

  /**
   * 流程图节点目前仅使用label属性，description未使用，icon使用固定的
   */
  public label!: string;
  public description!: string;
  public icon!: string;

  public props = {
    label: ['attrs', 'label', 'text'],
    description: ['attrs', 'description', 'text'],
    icon: ['attrs', 'icon', 'xlinkHref']
  };

  /**
   * BaseInspectorComponent类中抽象方法的实现
   */
  protected assignFormFields(): void {
    const { cell, props } = this;
    this.label = cell.prop(props.label);
    this.description = cell.prop(props.description);
    this.icon = cell.prop(props.icon);
  }
}
