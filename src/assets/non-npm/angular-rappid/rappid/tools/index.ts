import { dia, elementTools, linkTools, shapes,ui } from '@clientio/rappid';

import { RemoveTool } from './remove.tool';

export function addCellTools(cellView: dia.CellView): void {
    // !!利用库自带的Halo，自定义实现存在连线实现困难问题
    if (cellView.model.isLink()) {
        //addLinkTools(cellView as dia.LinkView);
        new ui.Halo({
            cellView,
            theme: 'modern',
            useModelGeometry:true,
            boxContent:false
        }).removeHandle('direction')
        .changeHandle('remove', { name:"remove",position: ui.Halo.HandlePosition.NE }).render();
    } else {
        // addElementTools(cellView as dia.ElementView);
        new ui.Halo({
            cellView,
            theme: 'modern',
            useModelGeometry:true,
            boxContent:false
        }).removeHandle('rotate').removeHandle('fork').removeHandle('unlink').removeHandle('clone')
          .changeHandle('link', { name:"link",position: ui.Halo.HandlePosition.NE }).render();
    }
}

export function addElementTools(elementView: dia.ElementView): void {
    const element = elementView.model as shapes.app.Base;
    const padding = element.getBoundaryPadding();
    const toolsView = new dia.ToolsView({
        tools: [
            new elementTools.Boundary({
                useModelGeometry: true,
                padding
            }),
            new RemoveTool({
                x: '100%',
                offset: {
                    x: padding.right,
                    y: -padding.top!
                }
            })
        ]
    });
    elementView.addTools(toolsView);
}

export function addLinkTools(linkView: dia.LinkView): void {
    const toolsView = new dia.ToolsView({
        tools: [
            new linkTools.Vertices(),
            new linkTools.SourceArrowhead(),
            new linkTools.TargetArrowhead(),
            new linkTools.Boundary({ padding: 15 }),
            new RemoveTool({ offset: -20, distance: 40 })
        ]
    });
    linkView.addTools(toolsView);
}
