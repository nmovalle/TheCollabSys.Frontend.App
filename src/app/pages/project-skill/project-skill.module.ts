import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectSkillRoutingModule } from './project-skill-routing.module';
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
    ProjectSkillRoutingModule
  ]
})
export class ProjectSkillModule { }
