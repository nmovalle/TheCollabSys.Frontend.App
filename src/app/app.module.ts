import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from './core/modules/primeng.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BrowserModule } from '@angular/platform-browser';
import { AppLayoutModule } from './shared/layout/app.layout.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule, 
        BrowserModule,
        PrimengModule, 
        AppLayoutModule,
        HttpClientModule, 
        OAuthModule.forRoot()
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
