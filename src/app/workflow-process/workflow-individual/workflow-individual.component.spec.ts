import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowIndividualComponent } from './workflow-individual.component';

describe('WorkflowIndividualComponent', () => {
  let component: WorkflowIndividualComponent;
  let fixture: ComponentFixture<WorkflowIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowIndividualComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
