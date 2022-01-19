import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-css-secrets',
  templateUrl: './css-secrets.component.html',
  styleUrls: ['./css-secrets.component.scss'],
})
export class CssSecretsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.info(1);
  }
}
