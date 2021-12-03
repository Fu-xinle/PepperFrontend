import { dia } from '@clientio/rappid';

import RappidService from '../../services/rappid.service';
import { Controller } from '../../rappid/controller';
import * as actions from '../../rappid/actions';

export class KeyboardController extends Controller {

    startListening() {

        const { keyboard } = this.service;

        this.listenTo(keyboard, {
            'escape': onEscape,
            'delete backspace': onDelete,
            'ctrl+0': onCtrlZero,
            'ctrl+plus': onCtrlPlus,
            'ctrl+minus': onCtrlMinus,
            'ctrl+z': onCtrlZ,
            'ctrl+y': onCtrlY,
            'ctrl+e': onCtrlE,
            'ctrl+o': onCtrlO,
            'ctrl+s': onCtrlS,
            'f12': onF12,
            'ctrl+d': onCtrlD,
        });
    }
}

function onEscape(service: RappidService): void {
    actions.setSelection(service, []);
}

function onDelete(service: RappidService): void {
    actions.removeSelection(service);
}

function onCtrlPlus(service: RappidService,  evt: dia.Event): void {
    evt.preventDefault();
    actions.zoomIn(service);
}

function onCtrlMinus(service: RappidService, evt: dia.Event): void {
    evt.preventDefault();
    actions.zoomOut(service);
}

function onCtrlZero(service: RappidService): void {
    actions.zoomToFit(service);
}

function onCtrlZ(service: RappidService): void {
    actions.undoAction(service);
}

function onCtrlY(service: RappidService): void {
    actions.redoAction(service);
}

function onCtrlE(service: RappidService): void {
    actions.exportToPNG(service);
}

function onCtrlO(service: RappidService, evt: dia.Event): void {
    evt.preventDefault();
    actions.setPropertyAction(service);
}

function onCtrlS(service: RappidService, evt: dia.Event): void {
    evt.preventDefault();
    actions.saveAction(service);
}

function onF12(service: RappidService, evt: dia.Event): void {
    evt.preventDefault();
    actions.saveAsAction(service);
}

function onCtrlD(service: RappidService, evt: dia.Event): void {
    evt.preventDefault();
    actions.debugAction(service);
}
