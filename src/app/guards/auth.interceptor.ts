import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Interceptor funcional para Angular standalone
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obtener el token de autenticación
  const authToken = localStorage.getItem('token');

  console.log('Interceptor - Token encontrado:', authToken);

  let authReq = req;

  //URLs públicas que no necesitan token
  const publicUrls = ['users/mails'];
  const isPublic = publicUrls.some(url => req.url.includes(url));
  
  // Clonar la request y agregar headers de autenticación si existe token
  if (authToken && !isPublic) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }
  
  // Continuar con la request y manejar errores
  return next(authReq).pipe(
    catchError(error => {
      // Si hay error 401 (no autorizado), redirigir al login
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};