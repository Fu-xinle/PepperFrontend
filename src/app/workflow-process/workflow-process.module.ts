import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WorkflowDetailComponent } from './workflow-detail/workflow-detail.component';
import { WorkflowDoneComponent } from './workflow-done/workflow-done.component';
import { WorkflowEndComponent } from './workflow-end/workflow-end.component';
import { WorkflowIndividualComponent } from './workflow-individual/workflow-individual.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { WorkflowProcessRoutingModule } from './workflow-process-routing.module';
import { WorkflowTodoComponent } from './workflow-todo/workflow-todo.component';

@NgModule({
  declarations: [
    WorkflowListComponent,
    WorkflowDetailComponent,
    WorkflowTodoComponent,
    WorkflowDoneComponent,
    WorkflowEndComponent,
    WorkflowIndividualComponent,
  ],
  imports: [CommonModule, WorkflowProcessRoutingModule],
})
export class WorkflowProcessModule {}
