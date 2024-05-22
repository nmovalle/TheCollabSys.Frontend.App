import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { ReadComponent } from './read/read.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'add', component: AddComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'read/:id', component: ReadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployersRoutingModule { }
