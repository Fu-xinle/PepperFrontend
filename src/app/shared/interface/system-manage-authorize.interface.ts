/**
 * 名称、密码以及验证码的信息验证提示对象
 */
export interface INamePasswordCaptchaNotification {
  userMessageShow: boolean;
  userMessage: string;
  passMessageShow: boolean;
  passMessage: string;
  captchaMessageShow: boolean;
  captchaMessage: string;
}

/**
 * 用户名和密码，存储在localstorage中的对象
 */
export interface IUsernamePassword {
  userName: string;
  password: string;
}

/**
 * 用户登录输入的验证信息
 */
export interface ILoginInputValue {
  inputName: string;
  inputPass: string;
  inputCaptcha: string;
  remember: boolean;
}
