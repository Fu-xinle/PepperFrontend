interface ISimpleInformationModel {
  id?: number;
  guid: string;
  name: string;
  description: string;
  createUser?: string;
  createTime?: string;
  isLeaf?: boolean;
  treeName?: string;
  parentGuid?: string;
}

/**
 * 地理处理模型对象接口
 */
export interface IGeoprocessingModel extends ISimpleInformationModel {}

/**
 * 流程对象接口
 */
export interface IFlowModel extends ISimpleInformationModel {}

/**
 * 表单对象接口
 */
export interface IFormModel extends ISimpleInformationModel {}

/**
 * 流程、表单、地理处理模型添加或者更新时，返回服务器端操作者和操作时间信息
 */
export interface IOperatorInformationModel {
  createUser: string;
  createTime: string;
}

/**
 *用户日志对象接口
 */
export interface IUserLog {
  id: number;
  userName: string;
  eventDescription: string;
  eventTime: string;
}

/**
 *流程图解析的连线对象接口
 */
export interface IFlowLink {
  sourceGuid: string;
  targetGuid: string;
}

/**
 * 流程图解析的节点对象接口
 */
export interface IFlowNode {
  guid: string;
  nodeName: string | undefined;
  nextNodeGuid: string | null;
}

/**
 * 表单的提示对象接口
 */
export interface IFormNotification {
  [key: string]: {
    message: string;
    show: boolean;
  };
}
