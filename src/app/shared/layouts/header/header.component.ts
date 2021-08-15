import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { SystemManageAuthorizeService } from '../../../system-manage-authorize/system-manage-authorize.service';
import { IUserInformation, IConfirmPasswordNotification, IConfirmPasswordValue } from '../../interface/system-manage.interface';
import { AuthService } from '../../services/auth/auth.service';
import { EventListenerService } from '../../services/event-listener.service';
import { NavigationService } from '../../services/navigation.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  // 修改密码对话框
  public changePasswordNotification: IConfirmPasswordNotification;
  public changePasswordForm: FormGroup;
  public loading: boolean = false;
  public loadingText: string = '';
  public modalReference!: NgbModalRef;

  /**网站的个人新通知 */
  public notifications: any[];

  /**用户信息，用于显示用户名 */
  public userInfo: IUserInformation;

  private subscriptions: Subscription[] = [];

  constructor(
    private navService: NavigationService,
    public domSanitizerService: DomSanitizer,
    public searchService: SearchService,
    private authService: AuthService,
    private systemManageAuthorizeService: SystemManageAuthorizeService,
    public eventListenerService: EventListenerService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    /** 修改密码对话框:表单信息通知、表单对象以及Input变化监测 */
    this.changePasswordNotification = {
      newPasswordMessageShow: false,
      newPasswordMessage: '请输入用户名',
      confirmNewPasswordMessageShow: false,
      confirmNewPasswordMessage: '密码输入不一致',
    };

    this.changePasswordForm = this.formBuilder.group({
      newPassword: [''],
      confirmNewPassword: [''],
    });

    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe((_value: string) => {
      this.changePasswordNotification.newPasswordMessageShow = false;
    });

    this.changePasswordForm.controls['confirmNewPassword'].valueChanges.subscribe((_value: string) => {
      this.changePasswordNotification.confirmNewPasswordMessageShow = false;
    });

    /** //!!网站个人通知初始化,后台获取 */
    this.notifications = [
      {
        icon: 'icon-Speach-Bubble7',
        title: 'New message',
        badge: '3',
        text: 'James: Hey! are you busy?',
        time: new Date(),
        status: 'primary',
        link: '/chat',
      },
      {
        icon: 'icon-Receipt-3',
        title: 'New order received',
        badge: '$4036',
        text: '1 Headphone, 3 iPhone x',
        time: new Date('11/11/2018'),
        status: 'success',
        link: '/tables/full',
      },
      {
        icon: 'icon-Empty-Box',
        title: 'Product out of stock',
        text: 'Headphone E67, R98, XL90, Q77',
        time: new Date('11/10/2018'),
        status: 'danger',
        link: '/tables/list',
      },
      {
        icon: 'icon-Data-Power',
        title: 'Server up!',
        text: 'Server rebooted successfully',
        time: new Date('11/08/2018'),
        status: 'success',
        link: '/dashboard/v2',
      },
      {
        icon: 'icon-Data-Block',
        title: 'Server down!',
        badge: 'Resolved',
        text: 'Region 1: Server crashed!',
        time: new Date('11/06/2018'),
        status: 'danger',
        link: '/dashboard/v3',
      },
    ];

    /** 用户在用户信息界面更换照片后，更新照片 */
    this.userInfo = this.authService.getUserInfo()!;
    this.eventListenerService.changePhotoAnnounced$.subscribe(_param => {
      this.userInfo = this.authService.getUserInfo()!;
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * header 头部中折叠/展开左侧导航栏
   *
   * @returns {boolean|undefined} Return
   */
  toggelSidebar() {
    const state = this.navService.sidebarState;
    if (state.childnavOpen && state.sidenavOpen) {
      return (state.childnavOpen = false);
    }
    if (!state.childnavOpen && state.sidenavOpen) {
      return (state.sidenavOpen = false);
    }
    // item has child items
    if (!state.sidenavOpen && !state.childnavOpen && this.navService.selectedItem.type === 'dropDown') {
      state.sidenavOpen = true;
      setTimeout(() => {
        state.childnavOpen = true;
      }, 50);
    }
    // item has no child items
    if (!state.sidenavOpen && !state.childnavOpen) {
      state.sidenavOpen = true;
    }
    return;
  }

  /**
   * 用户注销,退出登录
   */
  signout() {
    this.authService.logout();
    this.router.navigate(['content', 'system-manage-authorize', 'login']);
  }

  /**
   * 路由到用户信息详细页面,管理用户信息
   */
  userInformation() {
    this.router.navigate(['full', 'system-manage', 'user-info']);
  }

  /**
   * 利用ngbModal弹出修改密码对话框
   *
   * @param {TemplateRef<void>} content Parameter 对话框内容模板
   */
  changePassword(content: TemplateRef<void>) {
    this.modalReference = this.modalService.open(content, { centered: true });
    this.modalReference.result.then(
      _result => {},
      _reason => {
        /** 关闭对话框,关于控件的值需要重新初始化 */
        this.loading = false;
        this.changePasswordForm.controls['newPassword'].setValue('');
        this.changePasswordForm.controls['confirmNewPassword'].setValue('');
        Object.assign(this.changePasswordNotification, {
          newPasswordMessageShow: false,
          newPasswordMessage: '请输入用户名',
          confirmNewPasswordMessageShow: false,
          confirmNewPasswordMessage: '密码输入不一致',
        });
      }
    );
  }

  /**
   * 用户修改密码，新密码保存到数据库
   *
   * @param {IConfirmPasswordValue} value Parameter 用户输入的新密码以及确认密码（第二次输入）
   * @returns {void} Retunr
   */
  onSubmit(value: IConfirmPasswordValue) {
    /** 新密码一些判断:字符和数字5-30个，两次密码输入一致 */
    const newPassword: string = value.newPassword.toString().trim();
    if (!/^[0-9a-zA-Z]*$/g.test(newPassword)) {
      this.changePasswordNotification.newPasswordMessageShow = true;
      this.changePasswordNotification.newPasswordMessage = '密码只能包含字母或数字';
      return;
    }
    if (newPassword.length < 5 || newPassword.length > 30) {
      this.changePasswordNotification.newPasswordMessageShow = true;
      this.changePasswordNotification.newPasswordMessage = '5-30个字母或数字';
      return;
    }
    if (value.newPassword.toString().trim() !== value.confirmNewPassword.toString().trim()) {
      this.changePasswordNotification.confirmNewPasswordMessageShow = true;
      this.changePasswordNotification.confirmNewPasswordMessage = '密码输入不一致';
      return;
    }

    this.loading = true;
    this.loadingText = '提交中...';

    /** 保存到服务器 */
    this.subscriptions.push(
      this.systemManageAuthorizeService
        .resetPassword(this.authService.getUserInfo()!.userGUID, value.newPassword.toString().trim())
        .subscribe({
          next: _res => {
            this.loading = false;
            this.modalReference.close();
            this.countdownSweetalert2();
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

  /**
   * 利用Sweetalert2实现计时器跳转组件
   */
  countdownSweetalert2() {
    let timerInterval: NodeJS.Timer;
    Swal.fire({
      html: '密码重置成功!  <b></b> 秒后跳转到登录页面, ' + '<a href="#">点击跳转</a>',
      icon: 'success',
      allowOutsideClick: false,
      allowEscapeKey: false,
      timerProgressBar: true,
      timer: 60000,
      customClass: {
        container: 'countdown',
      },
      didOpen: () => {
        Swal.showLoading();
        /** 计时秒数倒数 */
        const swalContent: HTMLElement = Swal.getHtmlContainer()!;
        timerInterval = setInterval(() => {
          if (swalContent) {
            const bElement: HTMLElement | null = swalContent.querySelector('b');
            if (bElement) {
              bElement.textContent = parseInt((Swal.getTimerLeft()! / 1000).toString(), 10).toString();
            }
          }
        }, 1000);
        /** 跳转链接 */
        const aElement: HTMLElement | null = swalContent.querySelector('a');
        if (aElement) {
          aElement.onclick = () => {
            clearInterval(timerInterval);
            Swal.close();
            this.signout();
            return false;
          };
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
        this.signout();
      },
    }).then(_result => {});
  }
}
