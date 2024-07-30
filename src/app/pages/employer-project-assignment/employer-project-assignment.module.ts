import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerProjectAssignmentRoutingModule } from './employer-project-assignment-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ReadComponent } from './read/read.component';
import { PrimengModule } from '@app/core/modules/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    ReadComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    EmployerProjectAssignmentRoutingModule
  ]
})
export class EmployerProjectAssignmentModule { }
