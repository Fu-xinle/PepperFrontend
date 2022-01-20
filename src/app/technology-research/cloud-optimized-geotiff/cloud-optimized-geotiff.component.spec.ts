import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudOptimizedGeotiffComponent } from './cloud-optimized-geotiff.component';

describe('CloudOptimizedGeotiffComponent', () => {
  let component: CloudOptimizedGeotiffComponent;
  let fixture: ComponentFixture<CloudOptimizedGeotiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloudOptimizedGeotiffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudOptimizedGeotiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
