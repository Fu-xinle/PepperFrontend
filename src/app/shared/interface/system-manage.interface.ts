interface ISimpleInformationModel {
  id?: number;
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

interface ISimpleNode {
  guid: string;
  nodeName: string | undefined;
  nextNodeGuid: string | null;
}

/**
 *程图解析的连线对象接口
 */
export interface IFlowLink {
  sourceGuid: string;
  targetGuid: string;
}

/**
 * 流程图解析的节点对象接口
 */
export interface IFlowNode extends ISimpleNode {}

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
 *密码和确认密码信息验证提示对象
 */
export interface IConfirmPasswordNotification {
  newPasswordMessageShow: boolean;
  newPasswordMessage: string;
  confirmNewPasswordMessageShow: boolean;
  confirmNewPasswordMessage: string;
}

/**
 * 用户修改密码，密码和确认密码信息的验证信息
 */
export interface IConfirmPasswordValue {
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * 用户信息对象，根据需要扩充
 */
export interface IUserInformation {
  [key: string]: string;
  userGuid: string;
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
