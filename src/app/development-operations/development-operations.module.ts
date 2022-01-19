import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DevelopmentOperationsRoutingModule } from './development-operations-routing.module';
import { KanBanComponent } from './kan-ban/kan-ban.component';
import { WordChineseEnglishComponent } from './word-chinese-english/word-chinese-english.component';

@NgModule({
  declarations: [WordChineseEnglishComponent, KanBanComponent],
  imports: [CommonModule, DevelopmentOperationsRoutingModule],
})
export class DevelopmentOperationsModule {}
