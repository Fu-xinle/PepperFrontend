import { ObjectHash } from 'backbone';
import { dia, shapes  } from '@clientio/rappid'; 

import {
     FONT_FAMILY,
     MAIN_COLOR,
     PADDING_L,
     START_ICON,
     END_ICON,
     LIGHT_COLOR
 } from '../../config/theme';

 export enum ShapeTypesEnum {
    FLOW_NODE = 'stencil.FlowNode',
    START_NODE = 'stencil.StartNode',
    END_NODE = 'stencil.EndNode',
    BRANCH_NODE='stencil.BranchNode',
}

const SHAPE_SIZE = 42;

const StartNode = dia.Element.define(ShapeTypesEnum.START_NODE, {
    name: 'StartNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: '#4caf50',
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            refX: '50%',
            refY: '50%',
            width: 20,
            height: 20,
            x: -10,
            y: -10,
            xlinkHref: START_ICON
        },
        label: {
            text: '开始',
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
    }],
});

const EndNode = dia.Element.define(ShapeTypesEnum.END_NODE, {
    name: 'EndNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: '#d22346',
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            fill: '#FFFFFF',
            refX: '50%',
            refY: '50%',
            width: 20,
            height: 20,
            x: -10,
            y: -10,
            xlinkHref: END_ICON
        },
        label: {
            text: '结束',
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
        tagName: 'image',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
});

const BranchNode = dia.Element.define(ShapeTypesEnum.BRANCH_NODE, {
    name: 'BranchNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            strokeWidth: 0,
            refX: 0,
            refY: 0,
            refWidth: "100%",
            refHeight: "100%",
            refPoints:'50,0 100,50 50,100 0,50'
        },
        label: {
            text: '分支',
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
        tagName: 'polygon',
        selector: 'body'
    },
    {
        tagName: 'text',
        selector: 'label'
    }]
});

 const FlowNode = dia.Element.define(ShapeTypesEnum.FLOW_NODE, {
    name: 'FlowNode',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill:LIGHT_COLOR ,
            strokeWidth: 0.5,
            stroke: '#000000',
            refX: 0,
            refY: "20%",
            refWidth: "100%",
            refHeight: "60%",
            refRx: '8%',
            refRy: '8%',
        },
        label: {
            text: '节点',
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
        tagName: 'rect',
        selector: 'body'
    },
    {
        tagName: 'text',
        selector: 'label'
    }]
});

 Object.assign(shapes, {
    stencil: {
        FlowNode,
        StartNode,
        EndNode,
        BranchNode
    }
});
