import { dia, g, shapes, util } from '@clientio/rappid';
import {
    BACKGROUND_COLOR,
    DARK_COLOR,
    FONT_FAMILY,
    LIGHT_COLOR,
    LINE_WIDTH,
    MAIN_COLOR,
    PADDING_S,
    START_ICON,
    END_ICON
} from '../../config/theme';

export enum ShapeTypesEnum {
    BASE = 'app.Base',
    FLOW_NODE = 'app.FlowNode',
    BRANCH_NODE = 'app.BranchNode',
    START_NODE = 'app.StartNode',
    END_NODE = 'app.EndNode',
    LINK = 'app.Link'
}

const Base = dia.Element.define(ShapeTypesEnum.BASE, {
    // no default attributes
}, {
    getBoundaryPadding() {
        return util.normalizeSides(this.boundaryPadding);
    },

    toJSON() {
        // Simplify the element resulting JSON
        const json = dia.Element.prototype.toJSON.call(this);
        // Remove port groups and angle for better readability
        // delete json.ports.groups;
        // delete json.angle;
        return json;
    }
}, {

    fromStencilShape(element: dia.Element) {
        const attrs = {};
        return new this({ attrs });
    }

});

const FlowNode = Base.define(ShapeTypesEnum.FLOW_NODE, {
    size: { width: 120, height: 40 },
    attrs: {
        body: {
            fill: LIGHT_COLOR,
            strokeWidth: 0.5,
            stroke: '#000000',
            refX: 0,
            refY: 0,
            refWidth: "100%",
            refHeight: "100%",
            refRx: '5%',
            refRy: '15%',
        },
        label: {
            text: '节点名称',
            refX: "50%",
            refY: '50%',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 10
        }
    }
}, {

    markup: [{
        tagName: 'rect',
        selector: 'body'
    },
    {
        tagName: 'text',
        selector: 'label'
    }],

    boundaryPadding: {
        horizontal: PADDING_S,
        vertical: PADDING_S,
    },
});

const BranchNode = Base.define(ShapeTypesEnum.BRANCH_NODE, {
    size: { width: 80, height: 80 },
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
            text: '节点名称',
            refX: "50%",
            refY: '50%',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: '#ffffff',
            fontFamily: FONT_FAMILY,
            fontSize: 10
        }
    }
}, {

    markup: [{
        tagName: 'polygon',
        selector: 'body'
    },
    {
        tagName: 'text',
        selector: 'label'
    }],

    boundaryPadding: {
        horizontal: PADDING_S*2.5,
        vertical: PADDING_S*2.5,
    },
});

const StartNode = Base.define(ShapeTypesEnum.START_NODE, {
    size: { width: 42, height: 42 },
    attrs: {
        body: {
            fill: '#4caf50',
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%',
        },
        icon: {
            refX: '50%',
            refY: '50%',
            width: 20,
            height: 20,
            x: -10,
            y: -10,
            xlinkHref: START_ICON
        }
    }
}, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'image',
        selector: 'icon'
    }],
    boundaryPadding: {
        horizontal: PADDING_S,
        vertical: PADDING_S,
    }
});

const EndNode = Base.define(ShapeTypesEnum.END_NODE, {
    size: { width: 42, height: 42 },
    attrs: {
        body: {
            fill: '#d22346',
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%',
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
    }
}, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'image',
        selector: 'icon'
    }],
    boundaryPadding: {
        horizontal: PADDING_S,
        vertical: PADDING_S,
    }
});

export const Link =  dia.Link.define(ShapeTypesEnum.LINK, {
    attrs: {
        root: {
            cursor: 'pointer'
        },
        line: {
            fill: 'none',
            connection: true,
            stroke: DARK_COLOR,
            strokeWidth: 1
        },
        wrapper: {
            fill: 'none',
            connection: true,
            stroke: 'transparent',
            strokeWidth: 10
        },
        arrowhead: {
            d: 'M -5 -2.5 0 0 -5 2.5 Z',
            stroke: DARK_COLOR,
            fill: DARK_COLOR,
            atConnectionRatio: 1,
            strokeWidth: 1
        }
    },
    labels: [{
        attrs: {
            labelText: {
                text: '',
            }
        },
        position: {
            distance: 0.25
        }
    }]
}, {
    markup: [{
        tagName: 'path',
        selector: 'line'
    }, {
        tagName: 'path',
        selector: 'wrapper'
    }, {
        tagName: 'path',
        selector: 'arrowhead'
    }],
    defaultLabel: {
        markup: [{
            tagName: 'rect',
            selector: 'labelBody'
        }, {
            tagName: 'text',
            selector: 'labelText'
        }],
        attrs: {
            labelText: {
                fontFamily: FONT_FAMILY,
                fontSize: 10,
                textWrap: {
                    width: 200,
                    height: 100,
                    ellipsis: true
                },
                cursor: 'pointer',
                fill: DARK_COLOR,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                pointerEvents: 'none'
            },
            labelBody: {
                ref: 'labelText',
                fill: BACKGROUND_COLOR,
                stroke: BACKGROUND_COLOR,
                strokeWidth: 2,
                refWidth: '100%',
                refHeight: '100%',
                refX: 0,
                refY: 0
            }
        }
    }
});

Object.assign(shapes, {
    app: {
        Base,
        FlowNode,
        BranchNode,
        StartNode,
        EndNode,
        Link
    }
});
