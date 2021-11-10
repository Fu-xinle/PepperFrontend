import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { dia } from '@clientio/rappid';

export interface Properties {
  [property: string]: dia.Path;
}

@Component({ template: '' })
export abstract class BaseInspectorComponent implements OnChanges, OnDestroy {
  @Input() cell!: dia.Cell;

  public props!: Properties;

  public ngOnChanges(changes: SimpleChanges): void {
    if ('cell' in changes) {
      const { cell: change } = changes;
      if (!change.isFirstChange()) {
        this.removeCellListener(change.previousValue);
      }
      this.addCellListener(change.currentValue);
      this.assignFormFields();
    }
  }

  public ngOnDestroy(): void {
    this.removeCellListener(this.cell);
  }

  public changeCellProp(path: dia.Path, value: any): void {
    this.cell.prop(path, value);
  }

  protected abstract assignFormFields(): void;

  private addCellListener(cell: dia.Cell): void {
    cell.on('change', () => this.assignFormFields(), this);
  }

  private removeCellListener(cell: dia.Cell): void {
    cell.off(null, null, this);
  }
}
