import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { LicenseManager } from 'ag-grid-enterprise';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// ag-grid-enterprise 企业版本序列号
LicenseManager.setLicenseKey('OTQ1MzA4OTQ1Njk3Mw==390bb30c7ca829b2dcbef7b197f8d33e');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
