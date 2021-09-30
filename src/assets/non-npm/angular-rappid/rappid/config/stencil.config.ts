/*! Rappid v3.4.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2021 client IO

 2021-09-23 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import {
    CONFIRMATION_ICON,
    ENTITY_ICON,
    MESSAGE_ICON,
    USER_INPUT_ICON
} from '../../theme';

export const stencilConfig = {
    shapes: [{
        name: 'FlowchartStart'
    }, {
        name: 'FlowchartEnd'
    }, {
        name: 'Message',
        attrs: {
            label: { text: 'User action' },
            icon: { xlinkHref: USER_INPUT_ICON }
        }
    }, {
        name: 'Message',
        attrs: {
            label: { text: 'Entity' },
            icon: { xlinkHref: ENTITY_ICON }
        }
    }, {
        name: 'Message',
        attrs: {
            label: { text: 'Message' },
            icon: { xlinkHref: MESSAGE_ICON }
        }
    }, {
        name: 'Message',
        attrs: {
            label: { text: 'Confirmation' },
            icon: { xlinkHref: CONFIRMATION_ICON }
        }
    }]
};
