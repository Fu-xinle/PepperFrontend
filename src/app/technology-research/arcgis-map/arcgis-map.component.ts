import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arcgis-map',
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.scss'],
})
export class ArcgisMapComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.info(1);
  }
}
