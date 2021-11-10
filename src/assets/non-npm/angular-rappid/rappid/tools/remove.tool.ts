import { dia, elementTools } from '@clientio/rappid';

export const RemoveTool = elementTools.Remove.extend({
    options: {
        useModelGeometry: true,
        action: (evt: dia.Event, cellView: dia.CellView): void => {
            cellView.notify('cell:tool:remove', evt);
        },
        markup: [{
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 10,
                'fill': '#FD0B88',
                'cursor': 'pointer',
                'data-tooltip': '删除 <i>(Del)</i>',
                'data-tooltip-position': 'bottom'
            }
        }, {
            tagName: 'path',
            selector: 'icon',
            attributes: {
                'd': 'M -4 -4 4 4 M -4 4 4 -4',
                'fill': 'none',
                'stroke': '#FFFFFF',
                'stroke-width': 2,
                'pointer-events': 'none'
            }
        }]
    }
});
