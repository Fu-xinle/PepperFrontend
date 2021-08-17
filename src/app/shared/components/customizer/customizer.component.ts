import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ICustomizerLayout } from '../../interface/shared-layout.interface';
import { CustomizerService } from '../../services/customizer.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss'],
})
export class CustomizerComponent implements OnInit {
  /** Customizer面板是否打开 */
  public isOpen: boolean = false;

  /** 布局和主题颜色 */
  public layouts: ICustomizerLayout[] = [];

  constructor(public navigationService: NavigationService, public customizerService: CustomizerService, private router: Router) {}

  ngOnInit() {
    this.layouts = this.customizerService.layouts;
  }

  selectLayout(selectedLayout: ICustomizerLayout) {
    /** 选择 */
    this.customizerService.publishLayoutChange(selectedLayout.name);

    /** 更新路由菜单内容 */
    this.navigationService.publishNavigationChange(selectedLayout.name);

    /** 导航到主页 */
    this.router.navigate(['/']);
  }
}
