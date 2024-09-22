import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ReadComponent } from './read/read.component';
import { PrimengModule } from '@app/core/modules/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsModule } from '../clientes/clients.module';
import { SkillsComponent } from '@app/core/components/skills/skills.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    ReadComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectsRoutingModule,
    ClientsModule,
    SkillsComponent
  ]
})
export class ProjectsModule { }
