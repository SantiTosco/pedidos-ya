import { Routes } from '@angular/router';
import { TemplateComponent } from './pages/template/template.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreateOrder } from './pages/create-order/create-order';
import { ListOrderComponent } from './pages/list-order/list-order.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'create-order', component: CreateOrder },
      { path: 'list-order', component: ListOrderComponent }
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
