import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { PrimengModule } from '@app/core/modules/primeng.module';
import { RouterModule } from '@angular/router';

//Components
import { AppLayoutComponent } from './app.layout/app.layout.component';
import { AppTopbarComponent } from './app.topbar/app.topbar.component';
import { AppFooterComponent } from './app.footer/app.footer.component';
import { AppMenuComponent } from './app.menu/app.menu.component';
import { AppSidebarComponent } from './app.sidebar/app.sidebar.component';
import { AppConfigModule } from './config/config.module';
import { AppMenuitemComponent } from './app.menu/app.menuitem/app.menuitem.component';

// Importa AppLayoutRoutingModule
import { AppLayoutRoutingModule } from './app-layout-routing.module';

@NgModule({
  declarations: [
    AppMenuitemComponent,
    AppTopbarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppLayoutComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputTextModule,
    PrimengModule,
    RouterModule,
    AppConfigModule,
    AppLayoutRoutingModule
  ],
  exports: [AppLayoutComponent]
})
export class AppLayoutModule { }
