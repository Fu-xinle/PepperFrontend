import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcgisMapComponent } from './arcgis-map.component';

describe('ArcgisMapComponent', () => {
  let component: ArcgisMapComponent;
  let fixture: ComponentFixture<ArcgisMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArcgisMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcgisMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
