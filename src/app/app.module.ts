import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';

//components
import { AppComponent } from './app.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';

//modules
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { PrimengModule } from './core/modules/primeng.module';

//services
import { ProductService } from './core/service/product.service';
import { CountryService } from './core/service/country.service';
import { CustomerService } from './core/service/customer.service';
import { EventService } from './core/service/event.service';
import { IconService } from './core/service/icon.service';
import { NodeService } from './core/service/node.service';
import { PhotoService } from './core/service/photo.service';
import { MessageService } from 'primeng/api';


@NgModule({
    declarations: [
        AppComponent, 
        NotfoundComponent, 
        LoginComponent
    ],
    imports: [
        AppRoutingModule, 
        AppLayoutModule,
        PrimengModule,
        OAuthModule.forRoot()
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService, 
        CustomerService, 
        EventService, 
        IconService, 
        NodeService,
        PhotoService, 
        ProductService,
        MessageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
