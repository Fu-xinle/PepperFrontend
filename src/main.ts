import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import esriConfig from '@arcgis/core/config.js';
import { LicenseManager } from 'ag-grid-enterprise';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// ag-grid-enterprise 企业版本序列号
LicenseManager.setLicenseKey('OTQ1MzA4OTQ1Njk3Mw==390bb30c7ca829b2dcbef7b197f8d33e');

// arcgis-js-api的key值，用于访问arcgis-online上的服务
esriConfig.apiKey = 'AAPKc626e9f806e742b8979ed64af99c90883T96vc-6fQBPHFxXdxTWiFIdEvxSgwPXHMafJwu6RNyTjAJKpmsHMWNtzA_gTJNr';
esriConfig.assetsPath = '/assets/arcgis-js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
