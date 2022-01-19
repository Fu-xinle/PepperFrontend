import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CesiumEarthComponent } from './cesium-earth.component';

describe('CesiumEarthComponent', () => {
  let component: CesiumEarthComponent;
  let fixture: ComponentFixture<CesiumEarthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CesiumEarthComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CesiumEarthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
