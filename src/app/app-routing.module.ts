import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './shared/layout/app.layout/app.layout.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
            },
            {
                path: 'home', component: AppLayoutComponent,
            }
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
