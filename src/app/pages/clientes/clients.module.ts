import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//routing module
import { ClientsRoutingModule } from './clients-routing.module';

//components
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ReadComponent } from './read/read.component';


@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    ReadComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule
  ]
})
export class ClientsModule { }
