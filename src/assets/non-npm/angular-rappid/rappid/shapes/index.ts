import { dia } from '@clientio/rappid';

import './app.shapes';
import './stencil.shapes';

// extend joint.shapes namespace
declare module '@clientio/rappid' {
    namespace shapes {
        namespace app {
            class Base extends dia.Element {
                static fromStencilShape(element: dia.Element): Base;
                getBoundaryPadding(): dia.PaddingJSON;
            }
            class FlowNode extends Base {
                addDefaultPort(): void;
                canAddPort(group: string): boolean;
                toggleAddPortButton(group: string): void;
            }
            class GeoprocessingModelNode extends Base {
                addDefaultPort(): void;
                canAddPort(group: string): boolean;
                toggleAddPortButton(group: string): void;
            }
            class StartNode extends Base {
            }
            class EndNode extends Base {
            }
            class Link extends dia.Link {
            }
        }
        namespace stencil {
            class GeoprocessingModelNode extends dia.Element {
            }
            class FlowNode extends dia.Element {
            }
            class StartNode extends dia.Element {
            }
            class EndNode extends dia.Element {
            }
        }
    }
}
