import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../guards/auth.service'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // Importaciones para standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(){
        this.showPassword = !this.showPassword;
    }

  ngOnInit() {
    // 🔍 DEBUG: Ver estado inicial
    console.log('=== DEBUG AUTH STATE ===');
    console.log('Token en localStorage:', localStorage.getItem('token'));
    console.log('¿Está autenticado?', this.authService.isAuthenticated());
    console.log('URL actual:', this.router.url);
    
    // Suscribirse a cambios de estado de autenticación
    //this.authService.isAuthenticated$.subscribe(isAuth => {
    //  console.log('Estado de autenticación cambió a:', isAuth);
    //});
    
    // Suscribirse a cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navegación completada a:', event.url );
      }
    });
    setTimeout(() => {
    if (this.authService.isAuthenticated() && this.router.url === '/login') {
    console.log('⚠️ Usuario autenticado pero en login, redirigiendo...');
    this.router.navigate(['/dashboard']);
    }   
    }, 100);
  }
  

  private redirectToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('🔍 RESPUESTA COMPLETA DEL BACKEND:', response);
          console.log('🔍 response.user:', response.user);
          console.log('🔍 response.accessToken:', response.token);
          console.log('🔍 response.token:', response.token);
          console.log('🔍 Keys de la respuesta:', Object.keys(response));
          console.log('🔍 Tipo de response.user:', typeof response.user);
          if (response.success && response.token && response.user) {
            console.log('Login exitoso:', response.user);
            console.log('Respuesta completa:', response);
            // Guardar datos del usuario si es necesario
            localStorage.setItem('token', response.token!);
            localStorage.setItem('refreshToken', response.refreshToken || '');
            localStorage.setItem('user', JSON.stringify(response.user!));
            this.authService.updateAuthStatus(true);
            console.log('----------------------------------------------');
            this.authService.isAuthenticated$.subscribe(auth => {
            console.log('🔐 Estado de autenticación después del login:', auth);
            });
            console.log('----------------------------------------------');
            console.log('💾 Datos guardados en localStorage');
            console.log('🔑 Token:', localStorage.getItem('token'));
            console.log('👤 User:', localStorage.getItem('user'));
            console.log('Estado de autenticación actualizado');
            console.log('isAuthenticated$:', this.authService.isAuthenticated$);
            console.log('----------------------------------------------');
            console.log('🧭 Navegando a dashboard...');
            this.redirectToDashboard();
          } else {
            this.errorMessage = response.message || 'Error en el login';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Error de conexión. Intente nuevamente.';
          console.error('Error de login:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}