import { Routes } from '@angular/router';
import { TemplateComponent } from './pages/template/template.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreateOrder } from './pages/create-order/create-order';
import { ListOrderComponent } from './pages/list-order/list-order.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 🏠 Ruta raíz - redirige según autenticación
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },

  // 🔓 Rutas públicas (solo para usuarios NO autenticados)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard] // Redirige a dashboard si ya está logueado
  },
  {
    path: 'register', 
    component: RegisterComponent,
    canActivate: [loginGuard] // Redirige a dashboard si ya está logueado
  },
  {
    path: '', 
    component: HomeComponent,
    canActivate: [loginGuard] // Redirige a dashboard si ya está logueado
  },

  // 🔒 Dashboard como ruta protegida principal
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  
  // 🔒 Rutas protegidas con template
  {
    path: '',
    component: TemplateComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: '', 
        redirectTo: '', 
        pathMatch: 'full' 
      },
      { 
        path: '', 
        component: HomeComponent 
      },
      { 
        path: 'perfil', 
        component: PerfilComponent 
      },
      { 
        path: 'create-order', 
        component: CreateOrder 
      },
      { 
        path: 'list-order', 
        component: ListOrderComponent 
      }
    ]
  },

  // 🧪 Ruta de testing (temporal - quítala en producción)
  {
    path: 'test-dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
    // Sin guard para testing
  },
  
  // 🔄 Wildcard - redirige a login si no está autenticado
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];