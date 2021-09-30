import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDoneComponent } from './workflow-done.component';

describe('WorkflowDoneComponent', () => {
  let component: WorkflowDoneComponent;
  let fixture: ComponentFixture<WorkflowDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowDoneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
