import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowEndComponent } from './workflow-end.component';

describe('WorkflowEndComponent', () => {
  let component: WorkflowEndComponent;
  let fixture: ComponentFixture<WorkflowEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowEndComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
