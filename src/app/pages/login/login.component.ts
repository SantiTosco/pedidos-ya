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

  ngOnInit() {
    // 🔍 DEBUG: Ver estado inicial
    console.log('=== DEBUG AUTH STATE ===');
    console.log('Token en localStorage:', localStorage.getItem('accessToken'));
    console.log('¿Está autenticado?', this.authService.isAuthenticated());
    console.log('URL actual:', this.router.url);
    
    // Suscribirse a cambios de estado de autenticación
    this.authService.isAuthenticated$.subscribe(isAuth => {
      console.log('Estado de autenticación cambió a:', isAuth);
    });
    
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
          if (response.success) {
            console.log('Login exitoso:', response.user);
            console.log('Respuesta completa:', response);
            // Guardar datos del usuario si es necesario
            localStorage.setItem('authToken', response.token!);
            localStorage.setItem('user', response.user!);
        
            console.log('💾 Datos guardados en localStorage');
            console.log('🔑 Token:', localStorage.getItem('authToken'));
            console.log('👤 User:', localStorage.getItem('user'));

            this.router.navigate(['/dashboard']);
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Ingrese un email válido';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Contraseña'
    };
    return labels[fieldName] || fieldName;
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