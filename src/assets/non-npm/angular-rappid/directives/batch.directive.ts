/*! Rappid v3.4.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2021 client IO

 2021-09-23 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


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
