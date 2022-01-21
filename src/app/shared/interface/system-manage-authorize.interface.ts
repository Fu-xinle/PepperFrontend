/**
 * 用户基本信息
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

/**
 * 用户信息对象，根据需要扩充
 */
export interface IUserLoginInformation {
  userName: {
    message: string;
    show: boolean;
  };
  password: {
    message: string;
    show: boolean;
  };
  token: string;
  userInfo: IUserInformation;
  permissions: string[];
  role: string[];
}
