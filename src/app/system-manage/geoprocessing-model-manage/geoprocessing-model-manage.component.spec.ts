import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoprocessingModelManageComponent } from './geoprocessing-model-manage.component';

describe('GeoprocessingModelManageComponent', () => {
  let component: GeoprocessingModelManageComponent;
  let fixture: ComponentFixture<GeoprocessingModelManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeoprocessingModelManageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoprocessingModelManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
