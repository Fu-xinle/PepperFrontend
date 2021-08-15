import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoprocessingModelDesignComponent } from './geoprocessing-model-design.component';

describe('GeoprocessingModelDesignComponent', () => {
  let component: GeoprocessingModelDesignComponent;
  let fixture: ComponentFixture<GeoprocessingModelDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeoprocessingModelDesignComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoprocessingModelDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
