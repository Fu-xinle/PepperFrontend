import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DataMiningComponent } from './data-mining/data-mining.component';
import { RelevanceSearchComponent } from './relevance-search/relevance-search.component';
import { SpatialAnalysisComponent } from './spatial-analysis/spatial-analysis.component';
import { TechnologyResearchRoutingModule } from './technology-research-routing.module';
import { WebCrawlerComponent } from './web-crawler/web-crawler.component';

@NgModule({
  declarations: [WebCrawlerComponent, DataMiningComponent, RelevanceSearchComponent, SpatialAnalysisComponent],
  imports: [CommonModule, TechnologyResearchRoutingModule],
})
export class TechnologyResearchModule {}
