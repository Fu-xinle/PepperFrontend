import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-loading',
  templateUrl: './btn-loading.component.html',
  styleUrls: ['./btn-loading.component.scss'],
})
export class BtnLoadingComponent {
  @Input() loading: boolean = false;
  @Input() btnClass: string = '';
  @Input() loadingText = 'Please wait';
  @Input() type: 'button' | 'submit' = 'submit';

  constructor() {}
}
