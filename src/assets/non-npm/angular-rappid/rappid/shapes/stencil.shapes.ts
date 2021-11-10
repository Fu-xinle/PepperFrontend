import { ObjectHash } from 'backbone';
 
 import {
     DARK_COLOR,
     FONT_FAMILY,
     LIGHT_COLOR,
     MAIN_COLOR,
     MESSAGE_ICON,
     PADDING_L,
     TOOL_ICON
 } from '../../config/theme';
 import { dia, shapes } from '@clientio/rappid';

 export enum ShapeTypesEnum {
    GEOPROCESSING_MODEL_NODE = 'stencil.GeoprocessingModelNode',
    FLOW_NODE = 'stencil.FlowNode',
    START_NODE = 'stencil.StartNode',
    END_NODE = 'stencil.EndNode',
}

 const SHAPE_SIZE = 48;

 const StartNode = dia.Element.define(ShapeTypesEnum.START_NODE, {
    name: 'StartNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            d: 'M 2 8 L 4.29 5.71 L 1.41 2.83 L 2.83 1.41 L 5.71 4.29 L 8 2 L 8 8 Z M -2 8 L -8 8 L -8 2 L -5.71 4.29 L -1 -0.41 L -1 -8 L 1 -8 L 1 0.41 L -4.29 5.71 Z',
            fill: '#FFFFFF',
            refX: '50%',
            refY: '50%'
        },
        label: {
            text: 'Start',
            refDx: PADDING_L,
            refY: '50%',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
} as ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'path',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
});

 const EndNode = dia.Element.define(ShapeTypesEnum.END_NODE, {
    name: 'EndNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            d: 'M 5 -8.45 L 6.41 -7.04 L 3 -3.635 L 1.59 -5.04 Z M -4.5 3.95 L -1 3.95 L -1 -1.63 L -6.41 -7.04 L -5 -8.45 L 1 -2.45 L 1 3.95 L 4.5 3.95 L 0 8.45 Z',
            fill: '#FFFFFF',
            refX: '50%',
            refY: '50%'
        },
        label: {
            text: 'End',
            refDx: PADDING_L,
            refY: '50%',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        },
    }
} as ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'path',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
});

 const FlowNode = dia.Element.define(ShapeTypesEnum.FLOW_NODE, {
    name: 'FlowNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: LIGHT_COLOR,
            stroke: '#E8E8E8',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            width: 20,
            height: 20,
            refX: '50%',
            refY: '50%',
            x: -10,
            y: -10,
            xlinkHref: MESSAGE_ICON
        },
        label: {
            text: 'Component',
            refDx: PADDING_L,
            refY: '50%',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
} as ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'image',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }]
});

 const GeoprocessingModelNode = dia.Element.define(ShapeTypesEnum.GEOPROCESSING_MODEL_NODE, {
    name: 'GeoprocessingModelNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: LIGHT_COLOR,
            stroke: '#E8E8E8',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            width: 20,
            height: 20,
            refX: '50%',
            refY: '50%',
            x: -10,
            y: -10,
            xlinkHref: TOOL_ICON
        },
        label: {
            text: 'Component',
            refDx: PADDING_L,
            refY: '50%',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
} as ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'image',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }]
});

 Object.assign(shapes, {
    stencil: {
        GeoprocessingModelNode,
        FlowNode,
        StartNode,
        EndNode,
    }
});
