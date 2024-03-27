import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '@app/core/modules/primeng.module';

//Components
import { AppConfigComponent } from './app.config.component';

@NgModule({
  declarations: [
    AppConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimengModule
  ],
  exports: [
    AppConfigComponent
  ]
})
export class AppConfigModule { }
