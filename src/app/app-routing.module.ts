import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { GuestComponent } from './pages/guest/guest.component';
import { IdentifyComponent } from './pages/identify/identify.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: LoginComponent },
            { path: 'guest', component: GuestComponent },
            { path: 'forgot/:id', component: ForgotComponent },
            { path: 'identify', component: IdentifyComponent },
            { path: 'register', component: RegisterComponent },
            {
                path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule)
            },
            {
                path: 'landing', loadChildren: () => import('./shared/landing/landing.module').then(m => m.LandingModule)
            },
            {
                path: 'notfound', component: NotfoundComponent
            },
            {
                path: 'home', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                { path: '', loadChildren: () => import('./shared/dashboard/dashboard.module').then(m => m.DashboardModule) },
                ]
            },
            {
                path: 'clients', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                    { path: '', loadChildren: () => import('./pages/clientes/clients.module').then(m => m.ClientsModule) },
                ]
            },
            {
                path: 'employers', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                    { path: '', loadChildren: () => import('./pages/employers/employers.module').then(m => m.EmployersModule) },
                ]
            },
            {
                path: 'skills', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                    { path: '', loadChildren: () => import('./pages/skills/skills.module').then(m => m.SkillsModule) },
                    { path: 'categories', loadChildren: () => import('./pages/skill-category/skill-category.module').then(m => m.SkillCategoryModule) },
                ]
            },
            {
                path: 'projects', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                    { path: '', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule) },
                    { path: 'skills', loadChildren: () => import('./pages/project-skill/project-skill.module').then(m => m.ProjectSkillModule) },
                ]
            },
            {
                path: 'engineers', component: AppLayoutComponent, canActivate: [authGuard],
                children: [
                    { path: '', loadChildren: () => import('./pages/engineers/engineers.module').then(m => m.EngineersModule) },
                    { path: 'skills', loadChildren: () => import('./pages/engineer-skill/engineer-skill.module').then(m => m.EngineerSkillModule) },
                ]
            },
            { path: '**', redirectTo: '/notfound' },

            
        ], { useHash: false, scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
