import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

//routing module
import { ClientsRoutingModule } from './clients-routing.module';

//components
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ReadComponent } from './read/read.component';
import { PrimengModule } from 'src/app/core/modules/primeng.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    ReadComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    PrimengModule,
    FormsModule,
    InputTextModule
  ]
})
export class ClientsModule { }
