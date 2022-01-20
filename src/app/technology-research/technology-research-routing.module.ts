import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArcgisMapComponent } from './arcgis-map/arcgis-map.component';
import { CesiumEarthComponent } from './cesium-earth/cesium-earth.component';
import { ChatComponent } from './chat/chat.component';
import { CloudOptimizedGeotiffComponent } from './cloud-optimized-geotiff/cloud-optimized-geotiff.component';
import { CssSecretsComponent } from './css-secrets/css-secrets.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { RelevanceSearchComponent } from './relevance-search/relevance-search.component';
import { WebCrawlerComponent } from './web-crawler/web-crawler.component';

const routes: Routes = [
  {
    path: 'leaflet-map',
    component: LeafletMapComponent,
    data: {
      title: 'Leaflet地图',
    },
  },
  {
    path: 'arcgis-map',
    component: ArcgisMapComponent,
    data: {
      title: 'ArcGIS地图虫',
    },
  },
  {
    path: 'cesium-earth',
    component: CesiumEarthComponent,
    data: {
      title: '三维地图',
    },
  },
  {
    path: 'css-secrets',
    component: CssSecretsComponent,
    data: {
      title: 'CSS揭秘',
    },
  },
  {
    path: 'web-crawler',
    component: WebCrawlerComponent,
    data: {
      title: '爬虫',
    },
  },
  {
    path: 'chat',
    component: ChatComponent,
    data: {
      title: 'chat聊天',
    },
  },
  {
    path: 'relevance-search',
    component: RelevanceSearchComponent,
    data: {
      title: '相关性搜索',
    },
  },
  {
    path: 'cloud-optimized-geotiff',
    component: CloudOptimizedGeotiffComponent,
    data: {
      title: 'COG技术',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnologyResearchRoutingModule {}
