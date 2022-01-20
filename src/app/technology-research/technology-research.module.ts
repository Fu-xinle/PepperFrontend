import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArcgisMapComponent } from './arcgis-map/arcgis-map.component';
import { CesiumEarthComponent } from './cesium-earth/cesium-earth.component';
import { ChatComponent } from './chat/chat.component';
import { CloudOptimizedGeotiffComponent } from './cloud-optimized-geotiff/cloud-optimized-geotiff.component';
import { CssSecretsComponent } from './css-secrets/css-secrets.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { RelevanceSearchComponent } from './relevance-search/relevance-search.component';
import { TechnologyResearchRoutingModule } from './technology-research-routing.module';
import { WebCrawlerComponent } from './web-crawler/web-crawler.component';

@NgModule({
  declarations: [
    WebCrawlerComponent,
    LeafletMapComponent,
    ArcgisMapComponent,
    CesiumEarthComponent,
    CssSecretsComponent,
    ChatComponent,
    RelevanceSearchComponent,
    CloudOptimizedGeotiffComponent,
  ],
  imports: [CommonModule, TechnologyResearchRoutingModule],
})
export class TechnologyResearchModule {}
