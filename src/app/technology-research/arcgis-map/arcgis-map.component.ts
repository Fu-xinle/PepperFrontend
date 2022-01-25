import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

@Component({
  selector: 'app-arcgis-map',
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.scss'],
})
export class ArcgisMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  public view: any = null;

  initializeMap() {
    const container = this.mapViewEl.nativeElement;

    const map = new Map({
      basemap: 'arcgis-topographic',
    });

    this.view = new MapView({
      container,
      map: map,
      center: [-118.244, 34.052],
      zoom: 12,
    });
  }

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
  }
}
