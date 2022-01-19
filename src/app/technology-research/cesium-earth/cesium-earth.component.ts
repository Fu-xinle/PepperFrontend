import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cesium-earth',
  templateUrl: './cesium-earth.component.html',
  styleUrls: ['./cesium-earth.component.scss'],
})
export class CesiumEarthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.info(1);
  }
}
