import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { dia } from '@clientio/rappid';

import { EventBusService } from '../services/event-bus.service';
import { ShapeTypesEnum } from '../rappid/shapes/app.shapes';
import { SharedEvents } from '../rappid/controller';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss'],
})
export class InspectorComponent implements OnInit, OnDestroy {
  @Input() readonly = false;
  public cell!: any;
  private subscriptions = new Subscription();
  public shapeTypesEnum = ShapeTypesEnum;

  constructor(private readonly eventBusService: EventBusService) { }

  public ngOnInit(): void {
    this.subscriptions.add(this.eventBusService.listen(SharedEvents.SELECTION_CHANGED, (selection: dia.Cell[]) => this.setCell(selection)));
  }

  private setCell(selection: dia.Cell[]): void {
    const [cell = null] = selection;
    this.cell = cell;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
