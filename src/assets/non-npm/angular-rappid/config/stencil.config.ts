import {
    CONFIRMATION_ICON,
    ENTITY_ICON,
    MESSAGE_ICON,
    USER_INPUT_ICON
} from './theme';

export const stencilConfig = {
    shapes: [
        {
        name: 'StartNode',
        attrs: {
            label: { text: '开始' },
        }
    },
     {
        name: 'EndNode',
        attrs: {
            label: { text: '结束' },
        }
    },  
    {
        name: 'FlowNode',
        attrs: {
            label: { text: '节点' },
            icon: { xlinkHref: ENTITY_ICON }
        }
    }
]
};