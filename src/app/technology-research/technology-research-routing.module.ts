import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataMiningComponent } from './data-mining/data-mining.component';
import { RelevanceSearchComponent } from './relevance-search/relevance-search.component';
import { SpatialAnalysisComponent } from './spatial-analysis/spatial-analysis.component';
import { WebCrawlerComponent } from './web-crawler/web-crawler.component';

const routes: Routes = [
  {
    path: 'web-crawler',
    component: WebCrawlerComponent,
    data: {
      title: '爬虫',
    },
  },
  {
    path: 'data-mining',
    component: DataMiningComponent,
    data: {
      title: '数据挖掘',
    },
  },
  {
    path: 'relevance-search',
    component: RelevanceSearchComponent,
    data: {
      title: '全文检索',
    },
  },
  {
    path: 'spatial-analysis',
    component: SpatialAnalysisComponent,
    data: {
      title: '空间分析',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnologyResearchRoutingModule {}
