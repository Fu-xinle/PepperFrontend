import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KanBanComponent } from './kan-ban/kan-ban.component';
import { WordChineseEnglishComponent } from './word-chinese-english/word-chinese-english.component';

const routes: Routes = [
  {
    path: 'kan-ban',
    component: KanBanComponent,
    data: {
      title: 'KanBan任务',
    },
  },
  {
    path: 'word-chinese-english',
    component: WordChineseEnglishComponent,
    data: {
      title: '词汇表',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevelopmentOperationsRoutingModule {}
