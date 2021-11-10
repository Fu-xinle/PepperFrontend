import { dia, g, shapes, util } from '@clientio/rappid';
import {
    ADD_PORT_SIZE,
    BACKGROUND_COLOR,
    DARK_COLOR,
    FONT_FAMILY,
    LIGHT_COLOR,
    LINE_WIDTH,
    MAIN_COLOR,
    MAX_PORT_COUNT,
    OUT_PORT_HEIGHT,
    OUT_PORT_LABEL,
    OUT_PORT_WIDTH,
    PADDING_L,
    PADDING_S,
    PORT_BORDER_RADIUS,
    REMOVE_PORT_SIZE
} from '../../config/theme';

export enum ShapeTypesEnum {
    BASE = 'app.Base',
    GEOPROCESSING_MODEL_NODE = 'app.GeoprocessingModelNode',
    FLOW_NODE = 'app.FlowNode',
    START_NODE = 'app.StartNode',
    END_NODE = 'app.EndNode',
    LINK = 'app.Link'
}

const outputPortPosition = (portsArgs: dia.Element.Port[], elBBox: dia.BBox): g.Point[] => {
    const step = OUT_PORT_WIDTH + PADDING_S;
    return portsArgs.map((port: dia.Element.Port, index: number) => new g.Point({
        x: PADDING_L + OUT_PORT_WIDTH / 2, // + OUT_PORT_WIDTH / 2 + index * step,
        y: elBBox.height
    }));
};

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
        delete json.ports.groups;
        delete json.angle;
        return json;
    }
}, {

    fromStencilShape(element: dia.Element) {
        const attrs = {
            label: {
                text: element.attr(['label', 'text'])
            },
            body: {
                stroke: element.attr(['body', 'stroke']),
                fill: element.attr(['body', 'fill'])
            },
            icon: {
                xlinkHref: element.attr(['icon', 'xlinkHref'])
            },
            description: {
                text: element.attr(['description', 'text'])
            },
            moduleAnnotations: element.attr(['moduleAnnotations']),
            functionAnnotations: element.attr(['functionAnnotations']),
        };
        const ports = {
            items: element.attr(['ports', 'items'])
        };
        const size = {
            width: element.attr(['size', 'width'])
        };
        return new this({ attrs, ports, size });
    }

});

const GeoprocessingModelNode = Base.define(ShapeTypesEnum.GEOPROCESSING_MODEL_NODE, {
    size: { width: 368, height: 100 },
    ports: {
        groups: {
            in: {
                position: {
                    name: 'manual',
                    args: {
                        x: PADDING_L + OUT_PORT_WIDTH / 2,
                        y: 0
                    }
                },
                size: {
                    width: OUT_PORT_WIDTH,
                    height: OUT_PORT_HEIGHT
                },
                attrs: {
                    portBody: {
                        magnet: 'passive',
                        refWidth: '100%',
                        refHeight: '100%',
                        refX: '-50%',
                        refY: '-50%',
                        rx: PORT_BORDER_RADIUS,
                        ry: PORT_BORDER_RADIUS,
                        fill: LIGHT_COLOR,
                        strokeWidth: LINE_WIDTH / 2,
                        stroke: '#D4D4D4',
                    },
                    portLabel: {
                        pointerEvents: 'none',
                        fontFamily: FONT_FAMILY,
                        fontWeight: 400,
                        fontSize: 10,
                        fill: DARK_COLOR,
                        textAnchor: 'start',
                        textVerticalAnchor: 'middle',
                        textWrap: {
                            width: - REMOVE_PORT_SIZE / 4 - PADDING_L - PADDING_S,
                            maxLineCount: 2,
                            ellipsis: true
                        },
                        x: PADDING_L - OUT_PORT_WIDTH / 2
                    },
                },
                markup: [{
                    tagName: 'rect',
                    selector: 'portBody'
                }, {
                    tagName: 'text',
                    selector: 'portLabel',
                }]
            },
            out: {
                position: {
                    name: 'manual',
                    args: {
                        x: PADDING_L + OUT_PORT_WIDTH / 2, // + OUT_PORT_WIDTH / 2 + index * step,
                        y: 100
                    }
                },
                size: {
                    width: OUT_PORT_WIDTH,
                    height: OUT_PORT_HEIGHT
                },
                attrs: {
                    portBody: {
                        magnet: 'active',
                        refWidth: '100%',
                        refHeight: '100%',
                        refX: '-50%',
                        refY: '-50%',
                        fill: DARK_COLOR,
                        ry: PORT_BORDER_RADIUS,
                        rx: PORT_BORDER_RADIUS
                    },
                    portLabel: {
                        pointerEvents: 'none',
                        fontFamily: FONT_FAMILY,
                        fontWeight: 400,
                        fontSize: 10,
                        fill: LIGHT_COLOR,
                        textAnchor: 'start',
                        textVerticalAnchor: 'middle',
                        textWrap: {
                            width: - REMOVE_PORT_SIZE / 4 - PADDING_L - PADDING_S,
                            maxLineCount: 2,
                            ellipsis: true
                        },
                        x: PADDING_L - OUT_PORT_WIDTH / 2
                    },
                },
                markup: [{
                    tagName: 'rect',
                    selector: 'portBody'
                }, {
                    tagName: 'text',
                    selector: 'portLabel',
                }]
            }
        },
        items: []
        /* items: [{
            //     group: 'in'
            // }, {
            //     group: 'out',
            //     attrs: { portLabel: { text: '是否' } }
        }] */
        // ]
    },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: LIGHT_COLOR,
            strokeWidth: LINE_WIDTH / 2,
            stroke: '#D4D4D4',
            rx: 3,
            ry: 3,
        },
        label: {
            refX: 54 + 15,
            refY: PADDING_L + 15,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 16,
            fill: '#322A49',
            text: 'Label',
            textWrap: {
                width: - 54 - PADDING_L,
                maxLineCount: 1,
                ellipsis: true
            },
            textVerticalAnchor: 'top',
        },
        description: {
            refX: 54 + 15,
            refY: 53,
            fontFamily: FONT_FAMILY,
            fontWeight: 400,
            fontSize: 13,
            lineHeight: 13,
            fill: '#655E77',
            textVerticalAnchor: 'top',
            text: 'Description',
            textWrap: {
                width: - 54 - PADDING_L,
                maxLineCount: 2,
                ellipsis: true
            }
        },
        icon: {
            width: 20,
            height: 20,
            refX: PADDING_L + 15,
            refY: 39,
            xlinkHref: ''
        },
        /*     portAddButton: {
                    cursor: 'pointer',
                    fill: MAIN_COLOR,
                    event: 'element:port:add',
                    refX: '100%',
                    refX2: -28,
                    refY: '100%',
                    dataTooltip: 'Add Output Port',
                    dataTooltipPosition: 'top'
                },
                portAddButtonBody: {
                    width: ADD_PORT_SIZE,
                    height: ADD_PORT_SIZE,
                    rx: PORT_BORDER_RADIUS,
                    ry: PORT_BORDER_RADIUS,
                    x: -ADD_PORT_SIZE / 2,
                    y: -ADD_PORT_SIZE / 2,
                },
                portAddButtonIcon: {
                    d: 'M -4 0 4 0 M 0 -4 0 4',
                    stroke: '#FFFFFF',
                    strokeWidth: LINE_WIDTH
                } */
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label',
    }, {
        tagName: 'text',
        selector: 'description',
    }, {
        tagName: 'image',
        selector: 'icon',
    }],

    boundaryPadding: {
        horizontal: PADDING_L,
        top: OUT_PORT_HEIGHT / 2 + PADDING_L,
        bottom: OUT_PORT_HEIGHT / 2 + PADDING_L
    },

    addDefaultPort() {
        if (!this.canAddPort('out')) { return; }
        this.addPort({
            group: 'out',
            attrs: { portLabel: { text: OUT_PORT_LABEL } }
        });
    },

    canAddPort(group: string): boolean {
        return Object.keys(this.getGroupPorts(group)).length < MAX_PORT_COUNT;
    },

    toggleAddPortButton(group: string): void {
        const buttonAttributes = this.canAddPort(group)
            ? { fill: MAIN_COLOR, cursor: 'pointer' }
            : { fill: '#BEBEBE', cursor: 'not-allowed' };
        this.attr(['portAddButton'], buttonAttributes, {
            dry: true /* to be ignored by the Command Manager */
        });
    }
});

const FlowNode = Base.define(ShapeTypesEnum.FLOW_NODE, {
    size: { width: 240, height: 80 },
    ports: {
        groups: {
            in: {
                position: {
                    name: 'manual',
                    args: {
                        x: PADDING_L,
                        y: 0
                    }
                },
                size: {
                    width: 16,
                    height: 16
                },
                attrs: {
                    portBody: {
                        magnet: 'passive',
                        refWidth: '100%',
                        refHeight: '100%',
                        refY: '-50%',
                        rx: PORT_BORDER_RADIUS,
                        ry: PORT_BORDER_RADIUS,
                        fill: LIGHT_COLOR,
                        stroke: DARK_COLOR,
                        strokeWidth: LINE_WIDTH
                    }
                },
                markup: [{
                    tagName: 'rect',
                    selector: 'portBody'
                }]
            },
            out: {
                position: outputPortPosition,
                size: {
                    width: REMOVE_PORT_SIZE, // OUT_PORT_WIDTH,
                    height: REMOVE_PORT_SIZE, // OUT_PORT_HEIGHT
                },
                attrs: {
                    portBody: {
                        magnet: 'active',
                        refWidth: '100%',
                        refHeight: '100%',
                        // refX: '-50%',
                        refY: '-50%',
                        fill: DARK_COLOR,
                        ry: PORT_BORDER_RADIUS,
                        rx: PORT_BORDER_RADIUS
                    },
                    /* portLabel: {
                        pointerEvents: 'none',
                        fontFamily: FONT_FAMILY,
                        fontWeight: 400,
                        fontSize: 13,
                        fill: LIGHT_COLOR,
                        textAnchor: 'start',
                        textVerticalAnchor: 'middle',
                        textWrap: {
                            width: - REMOVE_PORT_SIZE - PADDING_L - PADDING_S,
                            maxLineCount: 1,
                            ellipsis: true
                        },
                        x: PADDING_L - OUT_PORT_WIDTH / 2
                    },
                    portRemoveButton: {
                        cursor: 'pointer',
                        event: 'element:port:remove',
                        refX: '-50%',
                        refDx: -PADDING_L,
                        dataTooltip: 'Remove Output Port',
                        dataTooltipPosition: 'top'
                    },
                    portRemoveButtonBody: {
                        width: REMOVE_PORT_SIZE,
                        height: REMOVE_PORT_SIZE,
                        x: -REMOVE_PORT_SIZE / 2,
                        y: -REMOVE_PORT_SIZE / 2,
                        fill: LIGHT_COLOR,
                        rx: PORT_BORDER_RADIUS,
                        ry: PORT_BORDER_RADIUS
                    },
                    portRemoveButtonIcon: {
                        d: 'M -4 -4 4 4 M -4 4 4 -4',
                        stroke: DARK_COLOR,
                        strokeWidth: LINE_WIDTH
                    } */
                },
                markup: [{
                    tagName: 'rect',
                    selector: 'portBody'
                }, /* {
                    tagName: 'text',
                    selector: 'portLabel',
                }, {
                    tagName: 'g',
                    selector: 'portRemoveButton',
                    children: [{
                        tagName: 'rect',
                        selector: 'portRemoveButtonBody'
                    }, {
                        tagName: 'path',
                        selector: 'portRemoveButtonIcon'
                    }]
                } */]
            }
        },
        items: [{
            group: 'in'
        }, {
            group: 'out',
            // attrs: { portLabel: { text: OUT_PORT_LABEL }}
        }]
    },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: LIGHT_COLOR,
            strokeWidth: LINE_WIDTH / 2,
            stroke: '#D4D4D4',
            rx: 3,
            ry: 3,
        },
        label: {
            refX: 54,
            refY: PADDING_L + 2*PADDING_S,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 14,
            fill: '#322A49',
            text: 'Label',
            textWrap: {
                width: - 54 - PADDING_L,
                maxLineCount: 1,
                ellipsis: true
            },
            textVerticalAnchor: 'top',
        },
        /*  description: {
             refX: 54,
             refY: 38,
             fontFamily: FONT_FAMILY,
             fontWeight: 400,
             fontSize: 13,
             lineHeight: 13,
             fill: '#655E77',
             textVerticalAnchor: 'top',
             text: 'Description',
             textWrap: {
                 width: - 54 - PADDING_L,
                 maxLineCount: 2,
                 ellipsis: true
             }
         }, */
        icon: {
            width: 20,
            height: 20,
            refX: PADDING_L,
            refY: 24+PADDING_S,
            xlinkHref: ''
        },
        /* portAddButton: {
            cursor: 'pointer',
            fill: MAIN_COLOR,
            event: 'element:port:add',
            refX: '100%',
            refX2: -28,
            refY: '100%',
            dataTooltip: 'Add Output Port',
            dataTooltipPosition: 'top'
        },
        portAddButtonBody: {
            width: ADD_PORT_SIZE,
            height: ADD_PORT_SIZE,
            rx: PORT_BORDER_RADIUS,
            ry: PORT_BORDER_RADIUS,
            x: -ADD_PORT_SIZE / 2,
            y: -ADD_PORT_SIZE / 2,
        },
        portAddButtonIcon: {
            d: 'M -4 0 4 0 M 0 -4 0 4',
            stroke: '#FFFFFF',
            strokeWidth: LINE_WIDTH
        } */
    }
}, {

    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label',
    }, /*  {
        tagName: 'text',
        selector: 'description',
    }, */ {
        tagName: 'image',
        selector: 'icon',
    }, /* {
        tagName: 'g',
        selector: 'portAddButton',
        children: [{
            tagName: 'rect',
            selector: 'portAddButtonBody'
        }, {
            tagName: 'path',
            selector: 'portAddButtonIcon'
        }]
    } */],

    boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_L,
        bottom: PADDING_L // + OUT_PORT_HEIGHT / 2 
    },

    addDefaultPort() {
        if (!this.canAddPort('out')) { return; }
        this.addPort({
            group: 'out',
            attrs: { portLabel: { text: OUT_PORT_LABEL } }
        });
    },

    canAddPort(group: string): boolean {
        return Object.keys(this.getGroupPorts(group)).length < MAX_PORT_COUNT;
    },

    toggleAddPortButton(group: string): void {
        const buttonAttributes = this.canAddPort(group)
            ? { fill: MAIN_COLOR, cursor: 'pointer' }
            : { fill: '#BEBEBE', cursor: 'not-allowed' };
        this.attr(['portAddButton'], buttonAttributes, {
            dry: true /* to be ignored by the Command Manager */
        });
    }
});

const StartNode = Base.define(ShapeTypesEnum.START_NODE, {
    size: { width: 48, height: 48 },
    ports: {
        groups: {
            out: {
                position: { name: 'bottom' },
                attrs: {
                    portBody: {
                        fill: DARK_COLOR,
                        stroke: BACKGROUND_COLOR,
                        strokeWidth: 6,
                        paintOrder: 'stroke',
                        magnet: 'active',
                        refR: '50%'
                    }
                },
                size: { width: 10, height: 10 },
                markup: [{
                    tagName: 'circle',
                    selector: 'portBody'
                }]
            }
        },
        items: [{ group: 'out' }]
    },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            r: 24
        },
        icon: {
            d: 'M 2 8 L 4.29 5.71 L 1.41 2.83 L 2.83 1.41 L 5.71 4.29 L 8 2 L 8 8 Z M -2 8 L -8 8 L -8 2 L -5.71 4.29 L -1 -0.41 L -1 -8 L 1 -8 L 1 0.41 L -4.29 5.71 Z',
            fill: LIGHT_COLOR,
            refX: '50%',
            refY: '50%'
        },
        label: {
            text: 'Flowchart start',
            textWrap: {
                width: 200,
                height: 100,
                ellipsis: true
            },
            refX: '50%',
            refY: -PADDING_L,
            textAnchor: 'middle',
            textVerticalAnchor: 'bottom',
            fill: '#55627B',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
}, {
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
    boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_S,
        bottom: PADDING_L
    }
});

const EndNode = Base.define(ShapeTypesEnum.END_NODE, {
    size: { width: 48, height: 48 },
    ports: {
        groups: {
            in: {
                position: { name: 'top' },
                attrs: {
                    portBody: {
                        fill: LIGHT_COLOR,
                        stroke: DARK_COLOR,
                        strokeWidth: 6,
                        paintOrder: 'stroke',
                        magnet: 'passive',
                        refR: '50%'
                    }
                },
                size: { width: 10, height: 10 },
                markup: [{
                    tagName: 'circle',
                    selector: 'portBody'
                }]
            }
        },
        items: [{ group: 'in' }]
    },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            r: 24
        },
        icon: {
            d: 'M 5 -8.45 L 6.41 -7.04 L 3 -3.635 L 1.59 -5.04 Z M -4.5 3.95 L -1 3.95 L -1 -1.63 L -6.41 -7.04 L -5 -8.45 L 1 -2.45 L 1 3.95 L 4.5 3.95 L 0 8.45 Z',
            fill: LIGHT_COLOR,
            refX: '50%',
            refY: '50%'
        },
        label: {
            text: 'Flowchart end',
            textWrap: {
                width: 200,
                height: 100,
                ellipsis: true
            },
            refX: '50%',
            refDy: PADDING_L,
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
            fill: '#55627B',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
}, {
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
    boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_L,
        bottom: PADDING_S
    }
});

export const Link = dia.Link.define(ShapeTypesEnum.LINK, {
    attrs: {
        root: {
            cursor: 'pointer'
        },
        line: {
            fill: 'none',
            connection: true,
            stroke: DARK_COLOR,
            strokeWidth: LINE_WIDTH
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
            atConnectionRatio: 0.55,
            strokeWidth: LINE_WIDTH
        }
    },
    labels: [{
        attrs: {
            labelText: {
                text: '', // 'Label',
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
                fontSize: 13,
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
        GeoprocessingModelNode,
        FlowNode,
        StartNode,
        EndNode,
        Link
    }
});
