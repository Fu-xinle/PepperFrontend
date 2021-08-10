import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmManageComponent } from './algorithm-manage.component';

describe('AlgorithmManageComponent', () => {
  let component: AlgorithmManageComponent;
  let fixture: ComponentFixture<AlgorithmManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlgorithmManageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
