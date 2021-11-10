import { Events } from 'backbone';
import RappidService from '../services/rappid.service';

export enum SharedEvents {
    JSON_EDITOR_CHANGED = 'json-editor-changed',
    SELECTION_CHANGED = 'selection-changed',
    GRAPH_CHANGED = 'graph-changed',
    GRAPH_START_BATCH = 'graph-start-batch',
    GRAPH_STOP_BATCH = 'graph-stop-batch',
}

type ControllerCallback = (service: RappidService, ...args: any[]) => void;

interface ControllerEventMap {
    [eventName: string]: ControllerCallback;
}

export abstract class Controller {

    constructor(public readonly service: RappidService) {
        this.startListening();
    }

    abstract startListening(): void;

    stopListening(): void {
        Events.stopListening.call(this);
    }

    protected listenTo(object: any, events: ControllerEventMap): void {
        Object.keys(events).forEach(event => {
            const callback = events[event];
            if (typeof callback !== 'function') return;
            // Invoke the callback with the service argument passed first
            Events.listenTo.bind(this, object, event, callback.bind(null, this.service))();
        });
    }
}
