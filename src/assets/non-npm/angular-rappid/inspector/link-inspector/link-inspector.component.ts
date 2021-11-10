import { Component, Input } from '@angular/core';
import { shapes } from '@clientio/rappid';

import { BaseInspectorComponent } from '../base-inspector/base-inspector.component';

@Component({
  selector: 'app-link-inspector',
  templateUrl: './link-inspector.component.html',
  styleUrls: ['../inspector.component.scss'],
})
export class LinkInspectorComponent extends BaseInspectorComponent {
  @Input() cell!: shapes.app.Link;

  public label!: string;

  public props = {
    label: ['labels', 0, 'attrs', 'labelText', 'text'],
  };

  protected assignFormFields(): void {
    const { cell, props } = this;
    this.label = cell.prop(props.label);
  }
}
