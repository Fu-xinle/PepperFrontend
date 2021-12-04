import { dia, ui,shapes } from '@clientio/rappid';
import { STENCIL_WIDTH,SECONDARY_BACKGROUND_COLOR, PADDING_L, PADDING_S } from '../../config/theme';
import { StencilNode } from '../shapes/stencil-tree.shapes';

/**
 * TreeLayout布局的节点信息
 */
 export interface  IStencilNode{
    guid?:string,
    name: string;
    category?:string;
    type?:number;
    parentGUID?:string;
    
    icon?: string;
    dir?: boolean;
    collapsed?: boolean;
    children?: Array<IStencilNode>
}

export function stencilGenerate(injectContext:{[key: string]: any},paper: dia.Paper | ui.PaperScroller): ui.Stencil {
    
    if (injectContext['stencil-type']==='TREE_LAYOUT') {
        const stencil = new ui.Stencil({
            paper,
            width: STENCIL_WIDTH*1.5,
            dropAnimation: true,
            usePaperGrid: true,
            contentOptions: {
                useModelGeometry: true
            },
            paperOptions: {
                async: true,
                sorting: dia.Paper.sorting.APPROX,
                frozen: true,
                viewport: function(view) {
                    const { model } = view;
                    // Never hide elements matched by the search
                    if (model.isElement() && model.isMatched()) return true;
                    if (model.isLink() && model.graph.get('grid')) return false;
                    // Hide elements and links which are currently collapsed
                    if (model.isHidden()) return false;
                    return true;
                }
            },
            search: (cell, keyword: string) => {
                if (keyword === '') return true;
                if (cell.isLink()) return false;
                // Do not show directories in the search results
                if ((<StencilNode>cell).isDirectory()) return false;
                const path = (<StencilNode>cell).getPathString().toLowerCase();
                return path.includes(keyword.toLowerCase());
            },
            // Can be a directory dragged & dropped?
            canDrag: (nodeView) => {
                const node = <StencilNode>nodeView.model;
                return !node.isDirectory();
            },
            // Replace the stencil shape with an actual shape while dragging
            // dragStartClone: (node) => onNodeDrop((node as StencilNode))
        });
    
        stencil.render();
    
        return stencil;

    } else {
        const stencil= new ui.Stencil({
            paper,
            width: STENCIL_WIDTH,
            height:"calc(100vh - 170px)" as any,
            scaleClones: true,
            dropAnimation: true,
            paperOptions: {
                sorting: dia.Paper.sorting.NONE,
                background: {
                    color: SECONDARY_BACKGROUND_COLOR
                }
            },
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

      stencil.render();

      return stencil;

    }
}
