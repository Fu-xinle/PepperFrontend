import { dia, ui, shapes,layout } from '@clientio/rappid';

import RappidService from '../services/rappid.service';
import { SharedEvents } from './controller';
import { addCellTools } from './tools';
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../config/theme';
import { stencilConfig } from '../config/stencil.config';
import {  ShapeTypesEnum } from './shapes/app.shapes';
import { PADDING_L ,DIRECTORY_ICON,FILE_ICON} from '../config/theme';
import { StencilNode,StencilLink } from './shapes/stencil-tree.shapes';
import { IStencilNode } from './stencil';

// Selection

export function setSelection(service: RappidService, selection: dia.Cell[]): void {
    const { paper, selection: previousSelection, eventBusService } = service;
    paper.removeTools();
    previousSelection.forEach(cell => {
        const cellView = cell.findView(paper);
        if (cellView) {
            cellView.vel.removeClass('selected');
        }
    });
    service.selection = selection;
    selection.forEach(cell => {
        const cellView = cell.findView(paper);
        if (cellView) {
            cellView.vel.addClass('selected');
            addCellTools(cellView);
        }
    });
    eventBusService.emit(SharedEvents.SELECTION_CHANGED, selection);
}

export function removeSelection(service: RappidService) {
    const { selection, graph } = service;
    if (selection.length === 0) return;
    graph.removeCells(selection);
}

// Zooming

export function zoomAtPoint(service: RappidService, deltaZoom: number, x: number, y: number): void {
    const { scroller } = service;
    scroller.zoom(deltaZoom, {
        min: ZOOM_MIN,
        max: ZOOM_MAX,
        grid: ZOOM_STEP,
        ox: x,
        oy: y
    });
}

export function zoomToFit(service: RappidService) {
    const { scroller } = service;
    scroller.zoomToFit({
        minScale: ZOOM_MIN,
        maxScale: ZOOM_MAX,
        scaleGrid: ZOOM_STEP,
        useModelGeometry: true,
        padding: PADDING_L
    });
}

export function zoomIn(service: RappidService) {
    const { scroller } = service;
    scroller.zoom(ZOOM_STEP, {
        min: ZOOM_MIN,
        max: ZOOM_MAX,
    });
}

export function zoomOut(service: RappidService) {
    const { scroller } = service;
    scroller.zoom(-ZOOM_STEP, {
        min: ZOOM_MIN,
        max: ZOOM_MAX,
    });
}

// Import / Export

export function exportToPNG(service: RappidService): void {
    const { paper } = service;
    paper.hideTools();
    paper.toPNG((dataURL: string): void => {
        paper.showTools();
        openImageDownloadDialog(service, dataURL);
    }, {
        padding: 10,
        useComputedStyles: false
    });
}

export function openImageDownloadDialog(service: RappidService, dataURL: string, fileName: string = 'Rappid'): void {
    const { keyboard, controllers } = service;
    const { keyboard: keyboardCtrl } = controllers;
    keyboardCtrl.stopListening();
    const lightbox = new ui.Lightbox({
        image: dataURL,
        downloadable: true,
        fileName
    });
    lightbox.on('action:close', () => {
        keyboardCtrl.startListening()
    });
    lightbox.listenTo(keyboard, 'escape', () => {
        keyboardCtrl.startListening();
        lightbox.close();
    });
    lightbox.open();
}

export function importGraphFromJSON(service: RappidService, json: any): void {
    setSelection(service, []);
    const { graph, history } = service;
    const shapeTypes = Object.values(ShapeTypesEnum);
    history.reset();
    try {
        if (json.cells.some((cell: any) => !shapeTypes.includes(cell.type))) {
            throw new Error('Invalid JSON: Unknown Cell Type');
        }
        graph.fromJSON(json);
    } catch (e) {
        // Invalid JSON format
    }
}

// Stencil

export function loadStencilShapes(service: RappidService): void {
    const { stencil } = service;
    const stencilShapes = stencilConfig.shapes.map(shape => new (shapes.stencil as any)[shape.name](shape));
    stencil.load(stencilShapes);
}

export function loadStencilTreeLayout(service: RappidService,list:IStencilNode): void {

    const { stencil } = service;
    
    const stencilPaper = stencil.getPaper();
    const stencilGraph = stencil.getGraph();
    const stencilCells = buildCellsFromList(list!);
    stencilGraph.resetCells(stencilCells);
    const [stencilRoot] = stencilGraph.getSources();

    const stencilTree = new layout.TreeLayout({
        graph: stencilGraph,
        direction: 'BR',
        parentGap: -20,
        siblingGap: 5,
        firstChildGap: 5,
        updateVertices: null,
        filter: (siblings, parent) => {
            // Layout will skip elements which have been collapsed
            if (!parent || !(parent as StencilNode).isCollapsed()) return siblings;
            return [];
        },
        updateAttributes: (_, node) => {
            // silent change of hidden attribute (there is no need to trigger an event)
            node.attributes.hidden = false;
            // Update some presentation attributes during the layout
            (node as StencilNode).toggleButtonVisibility(!stencilGraph.isSink(node));
            (node as StencilNode).toggleButtonSign(!(node as StencilNode).isCollapsed());
        }
    });

    function layoutTree() {
        // Reset tree layout start position
        stencilRoot.position(30, 10);
        // Or to Hide the first root level use this.
        // stencilRoot.position(10, -20);
        stencilGraph.getElements().forEach(el => el.attributes.hidden = true);
        stencilTree.layout();
        stencilPaper.fitToContent({
            minWidth: stencil.options.width,
            contentArea: stencilTree.getLayoutBBox(),
            padding: { bottom: 20 }
        } as dia.Paper.FitToContentOptions);
    }

    function resetTree(): void {
        stencilGraph.set('grid', false);
        // Set name value as label and reset text annotations
        stencilGraph.getElements().forEach((node) => (node as StencilNode).unmatch());
        layoutTree();
    }

    function layoutGrid(matchedGraph: dia.Graph): void {
        // Display grid layout when graph is filtered
        layout.GridLayout.layout(matchedGraph, {
            verticalAlign: 'top',
            horizontalAlign: 'left',
            columns: 1,
            columnWidth: 'auto',
            rowGap: 6,
            marginX: 10,
            marginY: 10
        });
    }

    function resetGrid(matchedGraph: dia.Graph, keyword: string): void {
        stencilGraph.set('grid', true);
        stencilGraph.getElements().forEach((node) => {
            if (matchedGraph.getCell(node.id)) {
                (node as StencilNode).match(keyword)
            } else {
                (node as StencilNode).unmatch();
            }
        });

        layoutGrid(matchedGraph);
    }

    function toggleBranch(root: StencilNode): void {
        const shouldHide = !root.isCollapsed();
        root.set({ collapsed: shouldHide });
        layoutTree();
    }

    // Events

    stencil.on('filter', (matchedGraph: dia.Graph, _group: string, keyword: string) => {
        if (keyword === '') {
            resetTree();
        } else {
            resetGrid(matchedGraph, keyword);
        }
    });

    stencilPaper.on('element:pointerdown', (view: dia.ElementView) => {
        const node = <StencilNode>view.model;
        if (node.isDirectory()) {
            toggleBranch(node);
        }
    });

    resetTree();
}

function buildCellsFromList(list: IStencilNode): Array<dia.Cell> {

    const elements: StencilNode[] = [];
    const links: StencilLink[] = [];

    const iterate = (obj: IStencilNode, pathArray: string[] = []): StencilNode => {

        const { name = '', icon = null, children = [], dir = false, collapsed = false } = obj;
        // Path displayed during search
        const path = pathArray.concat(name);
        const node = new StencilNode({ path, name, dir, collapsed });

        const defaultIcon = dir ? DIRECTORY_ICON : FILE_ICON;
        node.setIcon(icon || defaultIcon);
        node.attr(['root', 'dataDirectory'], dir);

        elements.push(node);

        children.forEach(child => {
            const childNode = iterate(child, path);
            const link = new StencilLink();
            link.connect(<string>node.id, <string>childNode.id);
            links.push(link);
        });

        return node;
    }

    iterate(list);

    return [...elements, ...links];
}


// Paper

export function updateLinksRouting(service: RappidService): void {
    const { paper, graph } = service;
    graph.getLinks().forEach(link => {
        const linkView = link.findView(paper) as dia.LinkView;
        if (linkView) {
            linkView.requestConnectionUpdate();
        }
    });
}

// History

export function undoAction(service: RappidService) {
    const { history } = service;
    history.undo();
}

export function redoAction(service: RappidService) {
    const { history } = service;
    history.redo();
}

//custom toolbar event

export function setPropertyAction(service: RappidService) {
    service.injectContext['toolbar-set-property'].bind(service.injectContext['inject-scope'])();
}

export function debugAction(service: RappidService) {
    service.injectContext['toolbar-debug'].bind(service.injectContext['inject-scope'])();
}

export function saveAction(service: RappidService) {
    service.injectContext['toolbar-save'].bind(service.injectContext['inject-scope'])();
}

export function saveAsAction(service: RappidService) {
    service.injectContext['toolbar-save-as'].bind(service.injectContext['inject-scope'])();
}
