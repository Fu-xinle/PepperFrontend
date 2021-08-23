import { Component } from '@angular/core';

import { CustomizerService } from '../../services/customizer.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent {
  constructor(public customizerService: CustomizerService) {}
}
