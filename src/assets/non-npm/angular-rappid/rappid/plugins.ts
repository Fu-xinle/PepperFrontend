import { dia, shapes, ui } from '@clientio/rappid';

import { enableVirtualRendering } from '../rappid/features/virtual-rendering';
import { toolbarConfig } from '../config/toolbar.config';
import { BACKGROUND_COLOR, SECONDARY_BACKGROUND_COLOR, GRID_SIZE, PADDING_L, PADDING_S,STENCIL_WIDTH } from '../config/theme';
import './shapes/index';

export function createPlugins(
    scopeElement: Element,
    paperElement: Element,
    stencilElement: Element,
    toolbarElement: Element,
    injectContext:{[key: string]: any}
) {
    // Graph
    // https://resources.jointjs.com/docs/jointjs/v3.1/joint.html#dia.Graph
    const graph = new dia.Graph({}, { cellNamespace: shapes });

    // Paper
    // https://resources.jointjs.com/docs/jointjs/v3.1/joint.html#dia.Paper
    const paper = new dia.Paper({
        model: graph,
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        gridSize: GRID_SIZE,
        linkPinning: false,
        multiLinks: false,
        snapLinks: true,
        moveThreshold: 5,
        magnetThreshold: 'onleave',
        background: { color: BACKGROUND_COLOR },
        cellViewNamespace: shapes,
        interactive: {
            labelMove: true,
            linkMove: false
        },
        defaultRouter: {
            name: 'manhattan',
            args: {
                padding: { bottom: PADDING_L, vertical: PADDING_S, horizontal: PADDING_S },
                step: GRID_SIZE
            }
        },
        defaultConnector: {
            name: 'rounded'
        },
        defaultLink: () => new shapes.app.Link(),
        validateConnection: (
            sourceView: dia.CellView,
            sourceMagnet: SVGElement,
            targetView: dia.CellView,
            targetMagnet: SVGElement
        ) => {
            if (sourceView === targetView) return false;
            if (targetView.findAttribute('port-group', targetMagnet) !== 'in') return false;
            if (sourceView.findAttribute('port-group', sourceMagnet) !== 'out') return false;
            return true;
        }
    });

    // PaperScroller Plugin (Scroll & Zoom)
    // https://resources.jointjs.com/docs/rappid/v3.1/ui.html#ui.PaperScroller
    const scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: true,
        contentOptions: {
            padding: 100,
            allowNewOrigin: 'any'
        },
        scrollWhileDragging: true,
        cursor: 'grab',
        baseWidth: 1000,
        baseHeight: 1000
    });
    paperElement.appendChild(scroller.el);
    scroller.render().center();

    // Render what the user sees, keeping the number of rendered cells to the minimum.
    enableVirtualRendering(scroller, { threshold: 50 });

    // Stencil Plugin (Element Palette)
    // https://resources.jointjs.com/docs/rappid/v3.1/ui.html#ui.Stencil
    const stencil = new ui.Stencil({
        paper: scroller,
        width: STENCIL_WIDTH,
        height:"calc(100vh - 180px)" as any,
        scaleClones: true,
        dropAnimation: true,
        paperOptions: {
            sorting: dia.Paper.sorting.NONE,
            background: {
                color: SECONDARY_BACKGROUND_COLOR
            }
        },
        groups: injectContext['stencil-group'] ? injectContext['stencil-group'] : undefined, 
        groupsToggleButtons: injectContext['stencil-group'] ? true : false ,
        search: injectContext['stencil-group'] ? {
            '*': ['type', 'attrs/text/text', 'attrs/root/dataTooltip', 'attrs/label/text']
        } : undefined,
        dragStartClone: (element) => {
            const name = element.get('name');
            const Shape = (shapes.app as any)[name];
            if (!Shape) throw new Error(`Invalid stencil shape name: ${name}`);
            return Shape.fromStencilShape(element);
        },
        layout: {
            columns: 1,
            rowGap: PADDING_S,
            rowHeight: 'auto',
            marginY: PADDING_S,
            marginX: -PADDING_L,
            dx: 0,
            dy: 0,
            resizeToFit: false
        }
    });
    stencilElement.appendChild(stencil.el);
    stencil.render();

    // Command Manager Plugin (Undo / Redo)
    // https://resources.jointjs.com/docs/rappid/v3.1/dia.html#dia.CommandManager
    const history = new dia.CommandManager({
        graph
    });

    // Toolbar Plugin
    // https://resources.jointjs.com/docs/rappid/v3.1/ui.html#ui.Toolbar
    const toolbar = new ui.Toolbar({
        tools: toolbarConfig.tools[injectContext['toolbar-name']],
        autoToggle: true,
        references: {
            paperScroller: scroller,
            commandManager: history
        }
    });
    toolbarElement.appendChild(toolbar.el);
    toolbar.render();

    // Tooltip plugin
    // https://resources.jointjs.com/docs/rappid/v3.1/ui.html#ui.Tooltip
    const tooltip = new ui.Tooltip({
        rootTarget: scopeElement,
        container: scopeElement,
        target: '[data-tooltip]',
        direction: ui.Tooltip.TooltipArrowPosition.Auto,
        padding: PADDING_S,
        animation: true
    });

    // Keyboard plugin
    // https://resources.jointjs.com/docs/rappid/v3.1/ui.html#ui.Keyboard
    const keyboard = new ui.Keyboard();

    return { graph, paper, scroller, stencil, toolbar, tooltip, keyboard, history };
}


