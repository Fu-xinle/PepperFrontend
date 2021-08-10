import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowManageComponent } from './flow-manage.component';

describe('FlowManageComponent', () => {
  let component: FlowManageComponent;
  let fixture: ComponentFixture<FlowManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlowManageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
