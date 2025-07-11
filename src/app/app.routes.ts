import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddCompetenceComponent } from './competences/add-competence.component';
import { CompetenceListComponent } from './competences/competence-list.component';


export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'Allusers',
    component: UserListComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'mes-competences',
    component: CompetenceListComponent
  },
  {
    path: 'ajouter-competence',
    component: AddCompetenceComponent
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'reset-password',
    loadComponent: () => import('./components/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  }
  
  
  
];
