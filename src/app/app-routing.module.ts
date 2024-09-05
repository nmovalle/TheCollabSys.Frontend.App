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
import { AccessCodeComponent } from './pages/register-domain/access-code/access-code.component';
import { DomainComponent } from './pages/register-domain/domain/domain.component';
import { ValidateInvitationComponent } from './pages/validate-invitation/validate-invitation/validate-invitation.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: LoginComponent },
            { path: 'guest', component: GuestComponent },
            { path: 'forgot/:id', component: ForgotComponent },
            { path: 'identify', component: IdentifyComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'access-code', component: AccessCodeComponent },
            { path: 'domain', component: DomainComponent },
            { path: 'validate-invitation/:token', component: ValidateInvitationComponent },
            {
              path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule).catch(err => {
                console.error('Error al cargar el módulo Auth', err);
                return Promise.reject(err);
              })
            },
            {
              path: 'landing', loadChildren: () => import('./shared/landing/landing.module').then(m => m.LandingModule).catch(err => {
                console.error('Error al cargar el módulo Landing', err);
                return Promise.reject(err);
              })
            },
            {
              path: 'notfound', component: NotfoundComponent
            },
            {
              path: 'home', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: '', loadChildren: () => import('./shared/dashboard/dashboard.module').then(m => m.DashboardModule).catch(err => {
                  console.error('Error al cargar el módulo Dashboard', err);
                  return Promise.reject(err);
                }) },
              ]
            },
            {
              path: 'clients', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: '', loadChildren: () => import('./pages/clientes/clients.module').then(m => m.ClientsModule).catch(err => {
                  console.error('Error al cargar el módulo Clients', err);
                  return Promise.reject(err);
                }) },
              ]
            },
            {
              path: 'employers', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: '', loadChildren: () => import('./pages/employers/employers.module').then(m => m.EmployersModule).catch(err => {
                  console.error('Error al cargar el módulo Employers', err);
                  return Promise.reject(err);
                }) },
                { path: 'assignments', loadChildren: () => import('./pages/employer-project-assignment/employer-project-assignment.module').then(m => m.EmployerProjectAssignmentModule).catch(err => {
                  console.error('Error al cargar el módulo EmployerProjectAssignment', err);
                  return Promise.reject(err);
                }) },
              ]
            },
            {
              path: 'skills', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: '', loadChildren: () => import('./pages/skills/skills.module').then(m => m.SkillsModule).catch(err => {
                  console.error('Error al cargar el módulo Skills', err);
                  return Promise.reject(err);
                }) },
                { path: 'categories', loadChildren: () => import('./pages/skill-category/skill-category.module').then(m => m.SkillCategoryModule).catch(err => {
                  console.error('Error al cargar el módulo SkillCategory', err);
                  return Promise.reject(err);
                }) },
                { path: 'subcategories', loadChildren: () => import('./pages/skill-subcategory/skill-subcategory.module').then(m => m.SkillSubcategoryModule).catch(err => {
                  console.error('Error al cargar el módulo SkillSubcategory', err);
                  return Promise.reject(err);
                }) },
              ]
            },
            {
              path: 'projects', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: '', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule).catch(err => {
                  console.error('Error al cargar el módulo Projects', err);
                  return Promise.reject(err);
                }) },
                { path: 'skills', loadChildren: () => import('./pages/project-skill/project-skill.module').then(m => m.ProjectSkillModule).catch(err => {
                  console.error('Error al cargar el módulo ProjectSkill', err);
                  return Promise.reject(err);
                }) },
                { path: 'assignments', loadChildren: () => import('./pages/project-assignment/project-assignment.module').then(m => m.ProjectAssignmentModule).catch(err => {
                  console.error('Error al cargar el módulo ProjectAssignment', err);
                  return Promise.reject(err);
                }) },
              ]
            },
            {
              path: 'engineers', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: '', loadChildren: () => import('./pages/engineers/engineers.module').then(m => m.EngineersModule).catch(err => {
                  console.error('Error al cargar el módulo Engineers', err);
                  return Promise.reject(err);
                }) },
                { path: 'skills', loadChildren: () => import('./pages/engineer-skill/engineer-skill.module').then(m => m.EngineerSkillModule).catch(err => {
                  console.error('Error al cargar el módulo EngineerSkill', err);
                  return Promise.reject(err);
                }) },
              ]
            },
            {
              path: 'menus', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: '', loadChildren: () => import('./pages/menus/menus.module').then(m => m.MenusModule).catch(err => {
                  console.error('Error al cargar el módulo Menus', err);
                  return Promise.reject(err);
                }) },
                { path: 'submenus', loadChildren: () => import('./pages/submenus/submenus.module').then(m => m.SubmenusModule).catch(err => {
                  console.error('Error al cargar el módulo Submenus', err);
                  return Promise.reject(err);
                }) },
                { path: 'config', loadChildren: () => import('./pages/menus-config/menus-config.module').then(m => m.MenusConfigModule).catch(err => {
                  console.error('Error al cargar el módulo MenusConfig', err);
                  return Promise.reject(err);
                }) },
              ]
            },{
              path: 'config', component: AppLayoutComponent, canActivate: [authGuard],
              children: [
                { path: 'invitations', loadChildren: () => import('./pages/config/invitation/invitation.module').then(m => m.InvitationModule).catch(err => {
                  console.error('Error al cargar el módulo Config Invitations', err);
                  return Promise.reject(err);
                }) },
              ]
            },
            { path: '**', redirectTo: '/notfound' },
          ], { useHash: false, scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })          
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
