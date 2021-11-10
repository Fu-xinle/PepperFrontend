import { Events } from 'backbone';
import { Subscription } from 'rxjs';
import { dia, ui } from '@clientio/rappid';

import { EventBusService } from './event-bus.service';
import { Controller } from '../rappid/controller';
import { createPlugins } from '../rappid/plugins';
import { RappidController, KeyboardController } from '../rappid/controllers';

export class RappidService {

    public controllers: { rappid: Controller, keyboard: Controller };
    public graph!: dia.Graph;
    public history!: dia.CommandManager;
    public keyboard!: ui.Keyboard;
    public paper!: dia.Paper;
    public selection: dia.Cell[] = [];
    public scroller!: ui.PaperScroller;
    public stencil!: ui.Stencil;
    public toolbar!: ui.Toolbar;
    public tooltip!: ui.Tooltip;

    private subscriptions = new Subscription();

    constructor(
        private scopeElement: Element,
        paperElement: Element,
        stencilElement: Element,
        toolbarElement: Element,
        public readonly eventBusService: EventBusService,
        public injectContext:{[key: string]: any}
    ) {
        Object.assign(this, createPlugins(scopeElement, paperElement, stencilElement, toolbarElement,injectContext));
        
        this.controllers = {
            rappid: new RappidController(this),
            keyboard: new KeyboardController(this)
        };
        this.subscriptions.add(
            // Translate RxJx notifications to Backbone Events
            eventBusService.events().subscribe(({ name, value }) => Events.trigger.call(eventBusService, name, value))
        );
    }

    public destroy(): void {
        const { paper, scroller, stencil, toolbar, tooltip, controllers, subscriptions } = this;
        paper.remove();
        scroller.remove();
        stencil.remove();
        toolbar.remove();
        tooltip.remove();
        Object.keys(controllers).forEach(name => (controllers as any)[name].stopListening());
        subscriptions.unsubscribe();
    }
}

export default RappidService;
