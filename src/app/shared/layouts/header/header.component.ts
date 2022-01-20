import { formatDate } from '@angular/common';
import { Component, ViewChild, OnDestroy, TemplateRef, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { SystemManageAuthorizeService } from '../../../system-manage-authorize/system-manage-authorize.service';
import { IUserInformation, IFormNotification } from '../../interface/system-manage-authorize.interface';
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
  /**对话框模板引用,利用ngbModal创建对话框，倒计时对话框 */
  @ViewChild('countdownModelContent') countdownModelContent!: TemplateRef<void>;

  /** countdown日期格式设置 */
  public config: CountdownConfig = {
    leftTime: 1 * 60,
    formatDate: ({ date, formatStr, timezone }) => {
      let f = formatStr;
      if (date > 1000 * 60) {
        f = 'm分s秒';
      } else if (date === 1000 * 60) {
        f = 'm分';
      } else {
        f = 's秒';
      }
      return formatDate(date, f, this.locale, timezone || '+0000');
    },
  };

  // 修改密码对话框
  public changePasswordNotification: IFormNotification;
  public changePasswordGroup: FormGroup;
  public loading: boolean = false;
  public loadingText: string = '';
  public modalReference!: NgbModalRef;

  /**网站的个人新通知 */
  public notifications: any[];

  /**用户信息，用于显示用户名 */
  public userInfo: IUserInformation;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private navService: NavigationService,
    public domSanitizerService: DomSanitizer,
    public searchService: SearchService,
    private authService: AuthService,
    private systemManageAuthorizeService: SystemManageAuthorizeService,
    public eventListenerService: EventListenerService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    /** 修改密码对话框:表单信息通知、表单对象以及Input变化监测 */
    this.changePasswordNotification = {
      newPassword: { message: '请输入用户名', show: false },
      confirmNewPassword: { message: '密码输入不一致', show: false },
    };

    this.changePasswordGroup = this.formBuilder.group({
      newPassword: [''],
      confirmNewPassword: [''],
    });

    for (const key in this.changePasswordGroup.controls) {
      if (this.changePasswordGroup.controls.hasOwnProperty(key)) {
        this.subscriptions.push(
          this.changePasswordGroup.controls[key].valueChanges.subscribe((_value: string) => {
            this.changePasswordNotification[key].show = false;
          })
        );
      }
    }

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
    this.subscriptions.push(
      this.eventListenerService.changePhotoAnnounced$.subscribe(_param => {
        this.userInfo = this.authService.getUserInfo()!;
      })
    );
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
    this.router.navigate(['./system-manage/user-info'], { relativeTo: this.activatedRoute });
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
        this.changePasswordGroup.controls['newPassword'].setValue('');
        this.changePasswordGroup.controls['confirmNewPassword'].setValue('');
        Object.assign(this.changePasswordNotification, {
          newPassword: { message: '请输入用户名', show: false },
          confirmNewPassword: { message: '密码输入不一致', show: false },
        });
      }
    );
  }

  /**
   * 用户修改密码，新密码保存到数据库
   *
   * @param {{ newPassword: string; confirmNewPassword: string }} value Parameter 用户输入的新密码以及确认密码（第二次输入）
   * @param {string} value.newPassword  用户新密码
   * @param {string} value.confirmNewPassword 用户确认新密码
   * @returns {void} Return  返回空
   */
  onSubmit(value: { newPassword: string; confirmNewPassword: string }) {
    /** 新密码一些判断:字符和数字5-30个，两次密码输入一致 */
    const newPassword: string = value.newPassword.toString().trim();
    if (!/^[0-9a-zA-Z]*$/g.test(newPassword)) {
      this.changePasswordNotification.newPassword.show = true;
      this.changePasswordNotification.newPassword.message = '密码只能包含字母或数字';
      return;
    }
    if (newPassword.length < 5 || newPassword.length > 30) {
      this.changePasswordNotification.newPassword.show = true;
      this.changePasswordNotification.newPassword.message = '5-30个字母或数字';
      return;
    }
    if (value.newPassword.toString().trim() !== value.confirmNewPassword.toString().trim()) {
      this.changePasswordNotification.confirmNewPassword.show = true;
      this.changePasswordNotification.confirmNewPassword.message = '密码输入不一致';
      return;
    }

    this.loading = true;
    this.loadingText = '提交中...';

    /** 保存到服务器 */
    this.subscriptions.push(
      this.systemManageAuthorizeService
        .resetPassword(this.authService.getUserInfo()!.userGuid, value.newPassword.toString().trim())
        .subscribe({
          next: _res => {
            this.loading = false;
            this.modalReference.close();
            this.modalReference = this.modalService.open(this.countdownModelContent, { centered: true, backdrop: 'static' });
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
   * countdown倒计时组件事件处理
   *
   * @param {CountdownEvent} event Parameter countdown倒计时组件事件对象
   */
  handleCountDownEvent(event: CountdownEvent) {
    if (event.action === 'done') {
      this.modalReference.close();
      this.signout();
    }
  }
}
