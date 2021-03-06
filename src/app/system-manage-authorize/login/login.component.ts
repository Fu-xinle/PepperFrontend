import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { sharedAnimations } from '../../shared/animations/shared-animations';
import { IFormNotification } from '../../shared/interface/system-manage.interface';
import { AuthService } from '../../shared/services/auth/auth.service';
import { SystemManageAuthorizeService } from '../system-manage-authorize.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [sharedAnimations],
})
export class LoginComponent implements OnInit, OnDestroy {
  /**登录信息对象reactForm以及登录过程中错误提示 */
  public loginGroup: FormGroup;
  public loginNotification: IFormNotification;

  /**登录验证完毕后,加载主页的提示 */
  public loading: boolean = false;
  public loadingText: string = '';

  /**用户名和面存储在localStorage中,加密key和索引key */
  private secretKey = 'F13EDECC-F4B0-48F6-B624-5CEA3F831F1D';
  private storeKey = '9887D92A-897E-4229-B6B1-A5C28FB79507';

  /**生成的验证码 */
  private captcha: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private systemManageAuthorizeService: SystemManageAuthorizeService,
    private toastr: ToastrService
  ) {
    /**初始化登录提示信息对象 */
    this.loginNotification = {
      userName: { message: '请输入用户名', show: false },
      password: { message: '密码错误', show: false },
      captcha: { message: '验证码错误', show: false },
      remember: { message: '', show: false },
    };

    /**获取localStorage存储用户名和密码 */
    if (localStorage[this.storeKey]) {
      this.loginGroup = this.formBuilder.group({
        userName: [this.aesDecrypt()['userName']],
        password: [this.aesDecrypt()['password']],
        captcha: [''],
        remember: [true],
      });
    } else {
      this.loginGroup = this.formBuilder.group({
        userName: [''],
        password: [''],
        captcha: [''],
        remember: [true],
      });
    }

    /**监测Input事件 */
    for (const key in this.loginGroup.controls) {
      if (this.loginGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.loginGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.loginNotification[key].show = false;
          })
        );
      }
    }
  }

  ngOnInit() {
    /**事件的顺序:NavigationStart-> ... ->NavigationEnd */
    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loadingText = '加载主页...';
          this.loading = true;
        }
        if (event instanceof NavigationEnd) {
          this.loadingText = '';
          this.loading = false;
        }
      })
    );

    /** 设置canvas的高度与宽度与父元素一样 */
    const canvas = document.querySelector('canvas')!;
    canvas.style.width = '100%';
    canvas.style.height = '33px';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.generateCaptcha();
  }

  onSubmit(value: { userName: string; password: string; captcha: string; remember: boolean }) {
    /**检查用户名为是否空 */
    if (!value.userName.toString().trim()) {
      this.loginNotification.userName.show = true;
      this.loginNotification.userName.message = '请输入用户名';
      return;
    }

    /**检查验证码错误是否错误 */
    if (value.captcha.toString().trim() !== this.captcha.join('')) {
      this.loginNotification.captcha.show = true;
      this.loginNotification.captcha.message = '验证码错误';
      this.captcha = [];
      this.generateCaptcha();
      return;
    }

    this.loadingText = '登陆中...';
    this.loading = true;

    /**后台验证用户信息，同时获取用户相关的权限、角色等信息,注入全局服务中 */
    this.subscriptions.push(
      this.systemManageAuthorizeService.login(value.userName.toString().trim(), value.password.toString().trim()).subscribe({
        next: res => {
          //!/**验证用户输入的是初始密码?如果是初始密码，弹出对话框，必须修改密码 */
          this.loginNotification = { userName: res.userName, password: res.password };
          if (!this.loginNotification.userMessageShow && !this.loginNotification.passMessageShow) {
            if (value.remember) {
              this.aesEncrypt({
                userName: value.userName.toString().trim(),
                password: value.password.toString().trim(),
              });
            } else {
              localStorage.removeItem(this.storeKey);
            }

            /**登录用户信息存储在全局的AuthService服务中 */
            this.authService.setToken(res.token);
            this.authService.setUserInfo(res.userInfo);

            /**导航到系统主页 */
            this.router.navigate(['/']);
          } else {
            this.loadingText = '登 录';
            this.loading = false;
          }
        },
        error: err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        complete: () => {
          /*Completed*/
        },
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * 验证码错误或者用户单机验证码图片时，重新生成验证码
   */
  reGenerateCaptcha() {
    this.captcha = [];
    this.generateCaptcha();
  }

  /**
   * 验证码生成函数
   */
  private generateCaptcha() {
    const canvasWidth: number = $('#canvas').width()!;
    const canvasHeight: number = $('#canvas').height()!;
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const sCode = 'A,B,C,D,E,F,G,H,K,M,N,P,Q,R,S,T,U,V,W,X,Y,Z,3,4,5,6,8,9';
    const aCode = sCode.split(',');
    const aLength = aCode.length;

    for (let i = 0; i <= 3; i++) {
      const j = Math.floor(Math.random() * aLength);
      const deg = (Math.random() * 30 * Math.PI) / 180;
      const txt = aCode[j];
      this.captcha[i] = txt.toLowerCase();
      const x = 10 + i * 20;
      const y = 20 + Math.random() * 8;
      context.font = 'bold 23px 微软雅黑';

      context.translate(x, y);
      context.rotate(deg);

      context.fillStyle = this.randomColor();
      context.fillText(txt, 0, 0);

      context.rotate(-deg);
      context.translate(-x, -y);
    }
    //验证码上显示线条
    for (let i = 0; i <= 5; i++) {
      context.strokeStyle = this.randomColor();
      context.beginPath();
      context.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
      context.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
      context.stroke();
    }
    //验证码上显示小点
    for (let i = 0; i <= 30; i++) {
      context.strokeStyle = this.randomColor();
      context.beginPath();
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.stroke();
    }
  }

  /**
   * 随机的颜色,验证码函数调用
   *
   * @returns {string} Return CSS中color的随机的颜色字符串值
   */
  private randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  /**
   * 用户名和密码加密存储在localStorage中
   *
   * @param {{ userName: string; password: string }}  mMessage  Parameter 用户名和密码对象
   * @param {string} mMessage.userName  用户名
   * @param {string} mMessage.password  密码
   */
  private aesEncrypt(mMessage: { userName: string; password: string }): void {
    localStorage[this.storeKey] = CryptoJS.AES.encrypt(JSON.stringify(mMessage), this.secretKey).toString();
  }

  /**
   * localStorage中的用户名和密码解密
   *
   * @returns {{ userName: string; password: string } }  用户名和密码对象
   */
  private aesDecrypt(): { userName: string; password: string } {
    const bytes = CryptoJS.AES.decrypt(localStorage[this.storeKey], this.secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(originalText);
  }
}
