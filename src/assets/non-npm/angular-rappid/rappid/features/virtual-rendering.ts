/*! Rappid v3.4.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2021 client IO

 2021-09-23 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { g, mvc, ui } from '@clientio/rappid';

interface VirtualRenderingOptions {
    threshold?: number;
}

export function enableVirtualRendering(scroller: ui.PaperScroller, options: VirtualRenderingOptions = {}) {
    const { paper } = scroller.options;
    const { threshold = 0 } = options;

    let viewportArea: g.Rect;
    function updateViewportArea() {
        viewportArea = scroller.getVisibleArea().inflate(threshold);
    }

    // Setup listeners
    updateViewportArea();
    scroller.on('scroll', updateViewportArea);
    paper.on('scale', updateViewportArea);

    // Paper `viewport` option
    // https://resources.jointjs.com/docs/jointjs/#dia.Paper.prototype.options.viewport
    paper.options.viewport = (view: mvc.View<any>) => {
        const { model } = view;
        // Hide elements and links which are not in the viewport.
        const bbox = model.getBBox();
        if (model.isLink()) {
            // Vertical/horizontal links have zero width/height.
            bbox.inflate(1);
        }
        return viewportArea.intersect(bbox) !== null;
    };
}
