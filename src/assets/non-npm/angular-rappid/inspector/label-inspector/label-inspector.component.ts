import { Component } from '@angular/core';

import { BaseInspectorComponent } from '../base-inspector/base-inspector.component';

@Component({
  selector: 'app-label-inspector',
  templateUrl: './label-inspector.component.html',
  styleUrls: ['../inspector.component.scss'],
})
export class LabelInspectorComponent extends BaseInspectorComponent {
  public label!: string;

  public props = {
    label: ['attrs', 'label', 'text'],
  };

  protected assignFormFields(): void {
    const { cell, props } = this;
    this.label = cell.prop(props.label);
  }
}
