import { dia, shapes, util } from '@clientio/rappid';

import RappidService from '../../services/rappid.service';
import { Controller, SharedEvents } from '../../rappid/controller';
import * as actions from '../../rappid/actions';

const DEBOUNCE_TIME_MS = 500;
const MOUSEWHEEL_DELTA_THROTTLE = 0.2;

export class RappidController extends Controller {

    startListening() {

        const { graph, paper, toolbar, eventBusService } = this.service;

        this.listenTo(eventBusService, {
            [SharedEvents.GRAPH_START_BATCH]: onGraphStartBatch,
            [SharedEvents.GRAPH_STOP_BATCH]: onGraphStopBatch
        });

        this.listenTo(graph, {
            'add': onCellAdd,
            'remove': onCellRemove,
            'change add remove': util.debounce(onGraphChange, DEBOUNCE_TIME_MS),
        });

        this.listenTo(paper, {
            'cell:mousewheel': onPaperCellMousewheel,
            'blank:mousewheel': onPaperBlankMousewheel,
            'blank:pointerdown': onPaperBlankPointerdown,
            'cell:pointerup': onPaperCellPointerup,
            'cell:tool:remove': onPaperCellToolRemove,
            'element:pointermove': onPaperElementPointermove,
            'element:pointerup': onPaperElementPointerup,
            'scale': onPaperScale
        });

        this.listenTo(toolbar, {
            'set-property:pointerclick': onToolbarSetPropertyPointerclick,
            'save:pointerclick': onToolbarSavePointerclick,
            'save-as:pointerclick': onToolbarSaveAsPointerclick,
            'debug:pointerclick': onToolbarDebugPointerclick,
        });
    }
}

// Event Bus Service

function onGraphStartBatch(service: RappidService, batchName: string): void {
    const { graph } = service;
    graph.startBatch(batchName);
}

function onGraphStopBatch(service: RappidService, batchName: string): void {
    const { graph } = service;
    graph.stopBatch(batchName);
}

// Graph

function onCellAdd(service: RappidService, cell: dia.Cell): void {
    if (cell.isLink()) return;
    // actions.setSelection(service, [cell]);
    actions.updateLinksRouting(service);
}

function onCellRemove(service: RappidService, removedCell: dia.Cell): void {
    const { selection } = service;
    if (!selection.includes(removedCell)) return;
    actions.setSelection(service, selection.filter(cell => cell !== removedCell));
    if (removedCell.isElement()) {
        actions.updateLinksRouting(service);
    }
}

function onGraphChange(service: RappidService): void {
    const { graph, eventBusService } = service;
    eventBusService.emit(SharedEvents.GRAPH_CHANGED, graph.toJSON());
}

// Paper

function onPaperBlankPointerdown(service: RappidService, evt: dia.Event): void {
    const { scroller } = service;
    actions.setSelection(service, []);
    scroller.startPanning(evt);
}

function onPaperBlankMousewheel(service: RappidService, evt: dia.Event, x: number, y: number, delta: number): void {
    evt.preventDefault();
    actions.zoomAtPoint(service, delta * MOUSEWHEEL_DELTA_THROTTLE, x, y);
}

function onPaperCellMousewheel(
    service: RappidService, _cellView: dia.CellView, evt: dia.Event, x: number, y: number, delta: number
): void {
    evt.preventDefault();
    actions.zoomAtPoint(service, delta * MOUSEWHEEL_DELTA_THROTTLE, x, y);
}

function onPaperCellPointerup(service: RappidService, cellView: dia.CellView): void {
    actions.setSelection(service, [cellView.model]);
}

function onPaperElementPointermove(service: RappidService, elementView: dia.ElementView, evt: dia.Event): void {
    const { paper } = service;
    const { data } = evt;
    // Run the code below on the first `pointermove` event only
    if (data.pointermoveCalled) return;
    data.pointermoveCalled = true;
    paper.hideTools();
}

function onPaperElementPointerup(service: RappidService, _elementView: dia.ElementView, evt: dia.Event): void {
    const { paper } = service;
    const { data } = evt;
    if (!data.pointermoveCalled) return;
    paper.showTools();
    actions.updateLinksRouting(service);
}


function onPaperCellToolRemove(_service: RappidService, cellView: dia.CellView, evt: dia.Event): void {
    cellView.model.remove();
}

function onPaperScale(service: RappidService): void {
    const { tooltip } = service;
    tooltip.hide();
}

// Toolbar

function onToolbarSavePointerclick(service: RappidService): void {
    actions.saveAction(service);
}

function onToolbarSaveAsPointerclick(service: RappidService): void {
    actions.saveAsAction(service);
}

function onToolbarSetPropertyPointerclick(service: RappidService): void {
    actions.setPropertyAction(service);
}

function onToolbarDebugPointerclick(service: RappidService): void {
    actions.debugAction(service);
}