import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';

// Components
import { AppComponent } from './app.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { PrimengModule } from './core/modules/primeng.module';

// Services
import { ProductService } from './core/service/product.service';
import { CountryService } from './core/service/country.service';
import { CustomerService } from './core/service/customer.service';
import { EventService } from './core/service/event.service';
import { IconService } from './core/service/icon.service';
import { NodeService } from './core/service/node.service';
import { PhotoService } from './core/service/photo.service';
import { MessageService } from 'primeng/api';

// Interceptor
import { AuthInterceptor } from './core/modules/auth-interceptor.interceptor';
import { GuestComponent } from './pages/guest/guest.component';
import { FormsModule } from '@angular/forms';
import { IdentifyComponent } from './pages/identify/identify.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
    declarations: [
        AppComponent, 
        NotfoundComponent, 
        LoginComponent,
        GuestComponent,
        IdentifyComponent,
        ForgotComponent,
        RegisterComponent
    ],
    imports: [
        AppRoutingModule, 
        AppLayoutModule,
        PrimengModule,
        OAuthModule.forRoot(),
        FormsModule
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
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
