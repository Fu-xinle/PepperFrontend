interface ISimpleInformationModel {
  id: number;
  guid: string;
  name: string;
  description: string;
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
 * 名称和描述的信息验证提示对象
 */
export interface INameDescriptionNotification {
  nameMessageShow: boolean;
  nameMessage: string;
  descriptionMessageShow: boolean;
  descriptionMessage: string;
}

/**
 * 用户信息对象，根据需要扩充
 */
export interface IUserInformation {
  [key: string]: string;
  userGUID: string;
  userName: string;
  realName: string;
  gender: string;
  phoneNumber: string;
  birthday: string;
  email: string;
  address: string;
  academicDegree: string;
  graduatedSchool: string;
  workPlace: string;
  photo: string;
}

/**
 * 用户信息对象编辑必填字段信息提示
 */
export interface IUserInformationNotification {
  phoneNumberMessageShow: boolean;
  phoneNumberMessage: string;
  emailMessageShow: boolean;
  emailMessage: string;
}

/**
 * 用户信息对象字段是否处于编辑状态
 */
export interface IUserInformationEditMark {
  [key: string]: boolean;
  realName: boolean;
  gender: boolean;
  phoneNumber: boolean;
  birthday: boolean;
  email: boolean;
  address: boolean;
  academicDegree: boolean;
  graduatedSchool: boolean;
  workPlace: boolean;
}
