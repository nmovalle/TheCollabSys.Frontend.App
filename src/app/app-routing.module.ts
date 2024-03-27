import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './shared/layout/app.layout/app.layout.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: AppLayoutComponent },
    { path: '**', redirectTo: '' } // Manejar rutas no encontradas
  ];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
  
export class AppRoutingModule {
}
