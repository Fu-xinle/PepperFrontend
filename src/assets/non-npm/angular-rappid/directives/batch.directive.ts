import { Directive } from '@angular/core';

import { EventBusService } from '../services/event-bus.service';
import { SharedEvents } from '../rappid/controller';

const BATCH_NAME = 'inspector-input';

@Directive({
    selector: '[batch]',
    host: {
        '(focus)': 'onFocus()',
        '(focusout)': 'onFocusOut()'
    }
})
export class BatchDirective {
    constructor(private eventBusService: EventBusService) {
    }

    public onFocus() {
        const { eventBusService } = this;
        eventBusService.emit(SharedEvents.GRAPH_START_BATCH, BATCH_NAME);
    }

    public onFocusOut() {
        const { eventBusService } = this;
        eventBusService.emit(SharedEvents.GRAPH_STOP_BATCH, BATCH_NAME);
    }
}
