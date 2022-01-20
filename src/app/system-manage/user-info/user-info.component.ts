import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbDatepickerI18n, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { IUserInformation, IUserInformationEditMark, IFormNotification } from '../../shared/interface/system-manage-authorize.interface';
import { AuthService } from '../../shared/services/auth/auth.service';
import { EventListenerService } from '../../shared/services/event-listener.service';
import { I18n, CustomDatepickerI18n, CustomAdapter, CustomDateParserFormatter } from '../../shared/services/i18n/datepicker';
import { GeneralUtils } from '../../shared/utils/general.utils';
import { PersonalCenterService } from '../service/personal-center.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  providers: [
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  /** 用户信息对象、用户信息编辑信息通知对象、用户信息编辑标志对象 */
  public userInfo: IUserInformation;
  public userInfoNotification: IFormNotification;
  public editState: IUserInformationEditMark;

  /**Select控件的Option选项 */
  public selectOptionsConfig = {
    gender: [] as Array<{ code: string; name: string }>,
    academicDegree: [] as Array<{ code: string; name: string }>,
  };

  /** 当前日期对象，设置ngbDate最大日期为当前日期  */
  public currentDateNgbStruct = GeneralUtils.dateToNgbDate(new Date())!;

  /**用户上传图片、裁切,更新头像 */
  public imageChangedEvent: Event | null = null;
  public croppedImage!: string;
  public isNewPicture = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public domSanitizerService: DomSanitizer,
    private authService: AuthService,
    private personalCenterService: PersonalCenterService,
    private toastr: ToastrService,
    private eventListenerService: EventListenerService
  ) {
    /** 用户信息初始化 */
    this.userInfo = JSON.parse(JSON.stringify(this.authService.getUserInfo()));

    /** 用户信息编辑标志对象初始化 */
    this.editState = {
      realName: false,
      gender: false,
      phoneNumber: false,
      birthday: false,
      email: false,
      address: false,
      academicDegree: false,
      graduatedSchool: false,
      workPlace: false,
    };

    /** 用户信息编辑信息通知对象初始化 */
    this.userInfoNotification = {
      phoneNumber: { message: '请输入正确格式的手机号码', show: false },
      email: { message: '请输入正确格式的邮箱地址', show: false },
    };

    /** 照片裁切初始化 */
    this.croppedImage = this.userInfo.photo;
  }

  ngOnInit(): void {
    /** 性别配置数据 */
    this.subscriptions.push(
      this.personalCenterService.genderOption().subscribe({
        next: res => {
          this.selectOptionsConfig.gender = res.genderOptions;
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

    /** 学历配置数据 */
    this.subscriptions.push(
      this.personalCenterService.academicDegreeOption().subscribe({
        next: res => {
          this.selectOptionsConfig.academicDegree = res.academicDegreeOptions;
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
   * 用户信息修改保存到数据库
   *
   * @param {string} fieldName  Parameter 字段的名称
   * @param {string} dbFieldName Parameter 字段对应的数据库表中字段的名称
   * @param {string} fieldValue  Parameter 字段的值
   * @returns {void}
   */
  saveEditInformation(fieldName: string, dbFieldName: string, fieldValue: string) {
    /** 手机号和邮箱的格式验证 */
    if (dbFieldName === 'phone_number' && !/^1[3456789]\d{9}$/.test(fieldValue)) {
      this.userInfoNotification.phoneNumber.show = true;
      return;
    }

    if (dbFieldName === 'email' && !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(fieldValue)) {
      this.userInfoNotification.email.show = true;
      return;
    }

    /** 用户信息修改保存到数据库 */
    this.subscriptions.push(
      this.personalCenterService.userInfoFieldSave(this.userInfo.userGuid, dbFieldName, fieldValue).subscribe({
        next: _res => {
          this.editState[fieldName] = false;
          this.userInfo[fieldName] = fieldValue;
          this.authService.setUserInfo(this.userInfo);
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
   * 用户信息编辑过程中取消编辑
   *
   * @param {string} fieldName  Parameter 字段的名称
   */
  cancelEditInformation(fieldName: string) {
    /** 取消用户信息编辑信息通知 */
    if (fieldName === 'phoneNumber') {
      this.userInfoNotification.phoneNumber.show = false;
    }
    if (fieldName === 'email') {
      this.userInfoNotification.email.show = false;
    }

    /** 值赋值为原值 */
    this.editState[fieldName] = false;
    this.userInfo[fieldName] = this.authService.getUserInfo()![fieldName];
  }

  /**
   * 通过一个按钮触发input[type='file']控件的上传事件
   */
  trickUpload() {
    $("input[type='file']").trigger('click');
  }

  /**
   * 选择或重新选择文件上传
   *
   * @param {Event} event Parameter 上传文件事件对象
   */
  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  /**
   * 用户裁切照片
   *
   * @param {ImageCroppedEvent} event 裁切照片的事件对象
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
    this.isNewPicture = true;
  }

  /**
   * 照片裁切后，用户确认更换照片
   */
  changePhoto() {
    this.subscriptions.push(
      this.personalCenterService
        .updatePhoto(this.userInfo.userGuid, this.croppedImage.toString().replace('data:image/png;base64,', ''))
        .subscribe({
          next: _res => {
            this.isNewPicture = false;
            this.imageChangedEvent = null;

            this.userInfo['photo'] = this.croppedImage;
            this.authService.setUserInfo(this.userInfo);

            /**通过全局事件监听服务，通知其他相关组件 */
            this.eventListenerService.changePhoto();
            this.toastr.success('头像照片更新成功!');
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
}
