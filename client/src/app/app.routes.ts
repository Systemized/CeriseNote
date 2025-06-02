import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard, dashRedirect } from './services/auth.guard';

export const routes: Routes = [

    {path: '', component: LandingComponent, canActivate: [dashRedirect]},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: 'about', component: LoginComponent},
    {path: 'features', component: LoginComponent},

];
