import { dia, shapes, ui } from '@clientio/rappid';

import { enableVirtualRendering } from '../rappid/features/virtual-rendering';
import { toolbarConfig } from '../config/toolbar.config';
import { stencilGenerate } from './stencil/index';
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
        frozen:false,
        sorting: dia.Paper.sorting.APPROX,
        gridSize: GRID_SIZE,
        linkPinning: false,
        multiLinks: true,
        snapLinks: false,
        moveThreshold: 5,
        magnetThreshold: 'onleave',
        background: { color: BACKGROUND_COLOR },
        cellViewNamespace: shapes,
        interactive: {
            labelMove: true,
            linkMove: true
        },
        defaultConnector: {
            name: 'normal'
        },
        defaultConnectionPoint:{
            name: 'boundary',
            args: {
                sticky: true
            }
        },
        defaultLink: () => new shapes.app.Link(),
        validateConnection: (
            sourceView: dia.CellView,
            sourceMagnet: SVGElement,
            targetView: dia.CellView,
            targetMagnet: SVGElement
        ) => {
            if (sourceView === targetView) return false;
            //if (targetView.findAttribute('port-group', targetMagnet) !== 'in') return false;
           // if (sourceView.findAttribute('port-group', sourceMagnet) !== 'out') return false;
            return true;
        }
    });

    // snapline
    var snaplines = new ui.Snaplines({ paper: paper })
    snaplines.startListening()

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
    // const stencil = new ui.Stencil({
    //     paper: scroller,
    //     width: STENCIL_WIDTH,
    //     height:"calc(100vh - 170px)" as any,
    //     scaleClones: true,
    //     dropAnimation: true,
    //     paperOptions: {
    //         sorting: dia.Paper.sorting.NONE,
    //         background: {
    //             color: SECONDARY_BACKGROUND_COLOR
    //         }
    //     },
    //     dragStartClone: (element) => {
    //         const name = element.get('name');
    //         const Shape = (shapes.app as any)[name];
    //         if (!Shape) throw new Error(`Invalid stencil shape name: ${name}`);
    //         return Shape.fromStencilShape(element);
    //     },
    //     layout: {
    //         columns: 1,
    //         rowGap: PADDING_S,
    //         rowHeight: 'auto',
    //         marginY: PADDING_S,
    //         marginX: -PADDING_L,
    //         dx: 0,
    //         dy: 0,
    //         resizeToFit: false
    //     }
    // });

    // const stencil = createStencil(scroller, 280, stencilNodes, (node) => {
    //     return new shapes.standard.Rectangle({
    //         size: {
    //             width: 120,
    //             height: 40
    //         },
    //         attrs: {
    //             body: {
    //                 fill: '#333',
    //                 stroke: '#F3F7F6',
    //                 rx: 3,
    //                 ry: 3
    //             },
    //             label: {
    //                 fill: '#fff',
    //                 fontSize: 15,
    //                 fontFamily: 'monospace',
    //                 text: `<${node.get('name')}>`
    //             }
    //         }
    //     })
    // });

    const stencil=stencilGenerate(injectContext,scroller);
    stencilElement.appendChild(stencil.el);
    stencil.el.dataset.textNoMatchesFound = '无匹配项'; 
    // !! 为什么freeze了?? 
    stencil.unfreeze();

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


const stencilNodes = {
    name: 'HTML',
    dir: true,
    children: [{
        name: 'Favorites',
        icon: 'assets/non-npm/angular-rappid/rappid/stencil/icon/favorite.svg',
        dir: true,
        children: [{
            name: 'svg',
            icon: 'assets/non-npm/angular-rappid/rappid/stencil/icon/link.svg'
        }],
    }, {
        name: 'Document metadata',
        dir: true,
        collapsed: true,
        children: [{
            name: 'base'
        }, {
            name: 'head'
        }, {
            name: 'link'
        }, {
            name: 'meta'
        }, {
            name: 'style'
        }, {
            name: 'title'
        }]
    }, {
        name: 'Content sectioning',
        dir: true,
        collapsed: true,
        children: [{
            name: 'address'
        }, {
            name: 'article'
        }, {
            name: 'aside'
        }, {
            name: 'footer'
        }, {
            name: 'header'
        }, {
            name: 'main'
        }, {
            name: 'nav'
        }, {
            name: 'section'
        }]
    }, {
        name: 'Text content',
        dir: true,
        collapsed: true,
        children: [{
            name: 'blockquote'
        }, {
            name: 'dd'
        }, {
            name: 'div'
        }, {
            name: 'dl'
        }, {
            name: 'dt'
        }, {
            name: 'figcaption'
        }, {
            name: 'figure'
        }, {
            name: 'hr'
        }, {
            name: 'li'
        }, {
            name: 'ol'
        }, {
            name: 'p'
        }, {
            name: 'pre'
        }, {
            name: 'ul'
        }]
    }, {
        name: 'Image and media',
        dir: true,
        collapsed: true,
        children: [{
            name: 'area'
        }, {
            name: 'audio'
        }, {
            name: 'img'
        }, {
            name: 'map'
        }, {
            name: 'track'
        }, {
            name: 'video'
        }]
    }, {
        name: 'Embedded content',
        dir: true,
        collapsed: true,
        children: [{
            name: 'embed'
        }, {
            name: 'iframe'
        }, {
            name: 'object'
        }, {
            name: 'param'
        }, {
            name: 'picture'
        }, {
            name: 'portal'
        }, {
            name: 'source'
        }]
    }, {
        name: 'SVG and MathML',
        dir: true,
        collapsed: true,
        children: [{
            name: 'svg'
        }, {
            name: 'math'
        }]
    }]
};