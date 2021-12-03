import { Component, Input } from '@angular/core';
import {
  PADDING_L,
  PADDING_S,
  PORT_BORDER_RADIUS
} from '../../config/theme';
import { shapes } from '@clientio/rappid';

import { BaseInspectorComponent } from '../base-inspector/base-inspector.component';


@Component({
  selector: 'app-geoprocessing-model-node-inspector',
  templateUrl: './geoprocessing-model-node-inspector.component.html',
  styleUrls: ['../inspector.component.scss'],
})
export class GeoprocessingModelNodeInspectorComponent extends BaseInspectorComponent {
  @Input() cell!: shapes.app.GeoprocessingModelNode;
  @Input() readonly = false;
  public label!: string;
  public description!: string;
  public icon!: string;
  public inPorts!: any[];
  public outPorts!: any[];

  public props = {
    parameter: ['attrs', 'parameter'],
    return: ['attrs', 'return'],
    label: ['attrs', 'label', 'text'],
    description: ['attrs', 'description', 'text'],
    icon: ['attrs', 'icon', 'xlinkHref'],
    portLabel: ['attrs', 'portLabel', 'text'],
  };

  public addCellPort(): void {
    //this.cell.addDefaultPort();
    this.assignFormPorts();
  }

  public removeCellPort(portId: string): void {
    this.cell.removePort(portId);
    this.assignFormPorts();
  }

  public changeCellPort(port: any): void {
    const { cell, props } = this;
    cell.portProp(port.id, props.portLabel, port.label);
  }

  public trackByPortId(index: number, port: any): string {
    return port.id;
  }

  protected assignFormFields(): void {
    const { cell, props } = this;
    this.label = cell.prop(props.label);
    this.description = cell.prop(props.description);
    this.icon = cell.prop(props.icon);
    this.assignFormPorts();
  }

  private assignFormPorts(): void {
    const { cell, props } = this;
    this.inPorts = cell.attributes.attrs!.functionAnnotations!.parameter;
    this.outPorts = cell.attributes.attrs!.functionAnnotations!.return;
  }

  public paramOpenChanged(portInfo: any) {
    if (portInfo.isOpen === 'P-Y') {
      // 添加端口，添加新的端口，首先增加宽度，然后增加端口
      this.cell.resize(this.calculateShapeWidth(portInfo), this.cell.attributes!.size!.height);

      let currentParamPortWidth = 0;
      let totalParamPortWidth = PADDING_L;
      this.cell.getGroupPorts('in').forEach((param) => {
        currentParamPortWidth = PORT_BORDER_RADIUS * 2 + (param.attrs!.parameter!.name_zh_cn.replace(/[^x00-xFF]/g, '**').length * 16) / 3;
        totalParamPortWidth = totalParamPortWidth + currentParamPortWidth + PADDING_S;
      });
      currentParamPortWidth = PORT_BORDER_RADIUS * 2 + (portInfo.name_zh_cn.replace(/[^x00-xFF]/g, '**').length * 16) / 3;

      this.cell.addPort({
        group: 'in',
        args: {
          x: totalParamPortWidth + currentParamPortWidth / 2,
        },
        size: {
          width: currentParamPortWidth,
        },
        attrs: {
          portLabel: {
            text: portInfo.name_zh_cn,
            x: PADDING_L - currentParamPortWidth / 2,
          },
          parameter: portInfo,
        },
      } as any, {
        size: {
          width: currentParamPortWidth,
        }
      });
    } else {
      // 关闭端口，根据port的id移除端口，首先移除端口，然后减少宽度
      let startRemove = false;
      let removePortWidth = 0;
      this.cell.getGroupPorts('in').forEach((param) => {
        if (startRemove) {
          this.cell.portProp(param.id!, ['args', 'x'], param.args!.x - removePortWidth - PADDING_S);
        }
        if (param.attrs!.parameter!.name_en === portInfo.name_en) {
          this.cell.removePort(param);
          startRemove = true;
          removePortWidth = (param as any).size.width;
        }
      });
      this.cell.resize(this.calculateShapeWidth(portInfo), this.cell.attributes!.size!.height);
    }
  }

  private calculateShapeWidth(portInfo: any): number {
    // 循环得到函数的输入参数
    let currentParamPortWidth = 0;
    let totalParamPortWidth = PADDING_L;
    this.cell.getGroupPorts('in').forEach((param) => {
      if (portInfo.isOpen === 'P-N' && param.attrs!.parameter!.name_en === portInfo.name_en) {

      } else {
        currentParamPortWidth = PORT_BORDER_RADIUS * 2 + (param.attrs!.parameter!.name_zh_cn.replace(/[^x00-xFF]/g, '**').length * 16) / 3;
        totalParamPortWidth = totalParamPortWidth + currentParamPortWidth + PADDING_S;
      }
    });

    if (portInfo.isOpen === 'P-Y') {
      currentParamPortWidth = PORT_BORDER_RADIUS * 2 + (portInfo.name_zh_cn.replace(/[^x00-xFF]/g, '**').length * 16) / 3;
      totalParamPortWidth = totalParamPortWidth + currentParamPortWidth + PADDING_S;
    }


    // 获取每个函数的返回值
    let currentRetPortWidth = 0;
    let totalRetPortWidth = PADDING_L;
    this.cell.getGroupPorts('out').forEach((ret) => {
      currentRetPortWidth = PORT_BORDER_RADIUS * 2 + (ret.attrs!.return!.name_zh_cn.replace(/[^x00-xFF]/g, '**').length * 16) / 3;
      totalRetPortWidth = totalRetPortWidth + currentRetPortWidth + PADDING_S;
    });

    // 根据port调整算法模型的宽度
    const autoWidth = totalParamPortWidth > totalRetPortWidth ? totalParamPortWidth : totalRetPortWidth;

    return autoWidth + PADDING_L > 368 ? autoWidth + PADDING_L : 368;
  }


}
