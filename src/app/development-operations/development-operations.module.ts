import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { KanBanComponent } from './kan-ban/kan-ban.component';
import { WordChineseEnglishComponent } from './word-chinese-english/word-chinese-english.component';
@NgModule({
  declarations: [WordChineseEnglishComponent, KanBanComponent],
  imports: [CommonModule],
})
export class DevelopmentOperationsModule {}
