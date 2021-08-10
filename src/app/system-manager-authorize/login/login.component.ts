import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';

import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { sharedAnimations } from '../../shared/animations/shared-animations';
import {
  IUsernamePassword,
  ILoginInputValue,
  INamePasswordCaptchaNotification,
} from '../../shared/interface/system-manager-authorize.interface';
import { AuthService } from '../../shared/services/auth/auth.service';
import { SystemManagerAuthorizeService } from '../system-manager-authorize.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [sharedAnimations],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginNotification: INamePasswordCaptchaNotification;
  public loginForm: FormGroup;
  public loading: boolean = false;
  public loadingText: string = '';

  private storeKey = '9887D92A-897E-4229-B6B1-A5C28FB79507';
  private secretKey = 'F13EDECC-F4B0-48F6-B624-5CEA3F831F1D';
  private captcha: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private systemManagerAuthorizeService: SystemManagerAuthorizeService,
    private toastr: ToastrService
  ) {
    this.loginNotification = {
      userMessageShow: false,
      userMessage: '请输入用户名',
      passMessageShow: false,
      passMessage: '密码错误',
      captchaMessageShow: false,
      captchaMessage: '验证码错误',
    };

    //利用localStorage存储用户名和密码
    if (localStorage[this.storeKey]) {
      this.loginForm = this.fb.group({
        inputName: [this.aesDecrypt()['userName']],
        inputPass: [this.aesDecrypt()['password']],
        inputCaptcha: [''],
        remember: [true],
      });
    } else {
      this.loginForm = this.fb.group({
        inputName: [''],
        inputPass: [''],
        inputCaptcha: [''],
        remember: [true],
      });
    }

    //监测Input事件
    this.loginForm.controls['inputName'].valueChanges.subscribe((_value: string) => {
      this.loginNotification.userMessageShow = false;
    });

    this.loginForm.controls['inputPass'].valueChanges.subscribe((_value: string) => {
      this.loginNotification.passMessageShow = false;
    });

    this.loginForm.controls['inputCaptcha'].valueChanges.subscribe((_value: string) => {
      this.loginNotification.captchaMessageShow = false;
    });
  }

  ngOnInit() {
    //是否有用??
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.loadingText = '加载主页...';

        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }
    });

    this.generateCaptcha();
  }

  onSubmit(value: ILoginInputValue) {
    //用户名为空
    if (!value.inputName.toString().trim()) {
      this.loginNotification.userMessageShow = true;
      this.loginNotification.userMessage = '请输入用户名';
      return;
    }

    //验证码错误
    if (value.inputCaptcha.toString().trim() !== this.captcha.join('')) {
      this.loginNotification.captchaMessageShow = true;
      this.loginNotification.captchaMessage = '验证码错误';
      this.captcha = [];
      this.generateCaptcha();
      return;
    }

    //服务后台进行验证，同时获取用户相关的权限、角色等信息
    //并将权限等信息注入全局服务中
    this.subscriptions.push(
      this.systemManagerAuthorizeService.login(value.inputName.toString().trim(), value.inputPass.toString().trim()).subscribe(
        res => {
          //用户登录验证:是否验证用户输入的是初始密码？
          //如果是初始密码，弹出对话框，必须修改密码
          //....

          this.loginNotification = res;
          if (!this.loginNotification.userMessageShow && !this.loginNotification.passMessageShow) {
            if (value.remember) {
              this.aesEncrypt({
                userName: value.inputName.toString().trim(),
                password: value.inputPass.toString().trim(),
              });
            } else {
              localStorage.removeItem(this.storeKey);
            }

            //登录用户信息存储在全局的AuthService服务中
            this.authService.setToken(res.token);
            this.authService.setUserInfo(res.userInfo);

            //导航到系统主页
            this.router.navigate(['/']);
          }
        },
        err => {
          console.error(err);
          this.toastr.error([err.url, err.error.errMessage, err.error.traceMessage].join('\n'), '错误');
        },
        () => {
          /*Completed*/
        }
      )
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  reGenerateCaptcha() {
    this.captcha = [];
    this.generateCaptcha();
  }

  generateCaptcha() {
    //生成随机验证码函数
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

  randomColor() {
    //生成验证码函数调用,形成随机的颜色
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  aesEncrypt(mMessage: IUsernamePassword): void {
    //用户名和密码加密，存储在localStorage中
    localStorage[this.storeKey] = CryptoJS.AES.encrypt(JSON.stringify(mMessage), this.secretKey).toString();
  }

  aesDecrypt(): IUsernamePassword {
    //用户名和密码解密，填充Form表单
    const bytes = CryptoJS.AES.decrypt(localStorage[this.storeKey], this.secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(originalText);
  }
}
