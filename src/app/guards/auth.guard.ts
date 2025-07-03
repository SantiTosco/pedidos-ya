import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

// Guard funcional para Angular standalone
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificar si el usuario está autenticado
  const isAuthenticated = checkAuthStatus();
  
  if (isAuthenticated) {
    return true;
  } else {
    // Redirigir al login si no está autenticado
    router.navigate(['/login']);
    return false;
  }
};

// Función auxiliar para verificar autenticación
function checkAuthStatus(): boolean {
  //verifica si el usuario está autenticado
  const token = localStorage.getItem('token'); //obtiene el token
  const user = localStorage.getItem('user'); //obtiene el usuario
  
  return !!(token && user); //devuelve true si el token y el usuario están presentes
}

// Guard para evitar que usuarios autenticados accedan al login
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = checkAuthStatus();
  
  if (isAuthenticated) {
    // Si ya está autenticado, redirigir al dashboard
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};