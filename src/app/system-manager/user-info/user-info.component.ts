import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbDatepickerI18n, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { IUserInformation, IUserInformationEditMark, IUserInformationNotification } from '../../shared/interface/system-manager.interface';
import { AuthService } from '../../shared/services/auth/auth.service';
import { EventListenerService } from '../../shared/services/event-listener.service';
import { I18n, CustomDatepickerI18n, CustomAdapter, CustomDateParserFormatter } from '../../shared/services/i18n/datepicker';
import { SystemManagerService } from '../system-manager.service';

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
  // 用户基本信息
  public userInfo: IUserInformation;
  public userInfoNotification: IUserInformationNotification;
  // 用户信息编辑状态标志
  public editState: IUserInformationEditMark;
  // select控件的option选项配置
  // 地址和毕业学校应调用云数据API???
  public selectOptionsConfig = {
    gender: [],
    academicDegree: [],
  };
  public cuurentDateNgbStruct = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  // 用户头像裁切
  public imageChangedEvent: Event | null = null;
  public croppedImage!: string;
  public isNewPicture = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public domSanitizerService: DomSanitizer,
    private authService: AuthService,
    private systemManagerService: SystemManagerService,
    private toastr: ToastrService,
    private eventListenerService: EventListenerService
  ) {
    // 获取用户的信息显示
    this.userInfo = JSON.parse(JSON.stringify(this.authService.getUserInfo()));

    // 用户基本信息开始编辑和结束编辑标志
    this.editState = {
      realName: false, //姓名
      gender: false, //性别
      phoneNumber: false, //手机号码
      birthday: false, //生日
      email: false, //邮箱
      address: false, //地址
      academicDegree: false, //学历或学位
      graduatedSchool: false, //毕业学校
      workPlace: false, //工作单位
    };

    // 手机号码和邮箱验证错误信息提示
    this.userInfoNotification = {
      phoneNumberMessageShow: false,
      phoneNumberMessage: '请输入正确格式的手机号码',
      emailMessageShow: false,
      emailMessage: '请输入正确格式的邮箱地址',
    };

    this.croppedImage = this.userInfo.photo;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.systemManagerService.genderOption().subscribe(
        res => {
          this.selectOptionsConfig.gender = res.genderOptions;
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
    this.subscriptions.push(
      this.systemManagerService.academicDegreeOption().subscribe(
        res => {
          this.selectOptionsConfig.academicDegree = res.academicDegreeOptions;
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

  saveEditInformation(fieldName: string, dbFieldName: string, fieldValue: string) {
    // 首先进行手机号和邮箱的判断
    if (dbFieldName === 'phone_number' && !/^1[3456789]\d{9}$/.test(fieldValue)) {
      this.userInfoNotification.phoneNumberMessageShow = true;
      return;
    }
    if (dbFieldName === 'email' && !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(fieldValue)) {
      this.userInfoNotification.emailMessageShow = true;
      return;
    }
    // 保存到数据库中，同时刷新服务中的用户的信息
    this.subscriptions.push(
      this.systemManagerService.userInfoFieldSave(this.userInfo.userGUID, dbFieldName, fieldValue).subscribe(
        _res => {
          this.editState[fieldName] = false;
          this.userInfo[fieldName] = fieldValue;
          // 更新到用户的userInfo的Token中
          this.authService.setUserInfo(this.userInfo);
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

  cancelEditInformation(fieldName: string) {
    if (fieldName === 'phoneNumber') {
      this.userInfoNotification.phoneNumberMessageShow = false;
    }
    if (fieldName === 'email') {
      this.userInfoNotification.emailMessageShow = false;
    }
    this.editState[fieldName] = false;
    // 需要重新获取对应的信息
    this.userInfo[fieldName] = this.authService.getUserInfo()![fieldName];
  }

  trickUpload() {
    $("input[type='file']").trigger('click');
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
    this.isNewPicture = true;
  }

  changePhoto() {
    //更换照片后，发送全局信息，其他地方更改照片
    this.subscriptions.push(
      this.systemManagerService
        .updatePhoto(this.userInfo.userGUID, this.croppedImage.toString().replace('data:image/png;base64,', ''))
        .subscribe(
          _res => {
            this.isNewPicture = false;
            this.imageChangedEvent = null;

            this.userInfo['photo'] = this.croppedImage;
            this.authService.setUserInfo(this.userInfo);

            //服务发送消息
            this.eventListenerService.changePhoto();
            this.toastr.success('头像照片更新成功!');
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
}
