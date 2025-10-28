import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../guards/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;
    registerForm: FormGroup;
    loading = false;
    showWelcomeMessage = false;
    errorMessage = '';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,

        
    ) {
        this.registerForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur' // Ejecuta la validación cuando se deja el campo
            }],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        },{
        validators: (control: AbstractControl) => {
            const password = control.get('password');
            const confirmPassword = control.get('confirmPassword');
            return password?.value === confirmPassword?.value ? null : { passwordMismatch: true };
            }
        });
    }

    // Cambia la visibilidad del campo de la contraseña
    togglePassword(){
        this.showPassword = !this.showPassword;
    }

    // Cambia la visibilidad del campo de la confirmación de contraseña
    toggleConfirmPassword(){
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    // Te lleva al dashboard despues de registrarte o iniciar sesión
    redirectToDashboard(){  
        this.router.navigate(['/dashboard']);
    }

    // Manejo del formulario de registro, y hace un login automático para no tener que iniciar sesión
    onSubmit() {
        console.log('onSubmit ejecutado');
        
        if (this.registerForm.valid) {
            this.loading = true;
            this.errorMessage = '';
            
            const registerData = {
                email: this.registerForm.value.email,
                password: this.registerForm.value.password
            };
    
            console.log('📤 Enviando datos:', registerData);             
            this.authService.register(registerData).subscribe({
                next: (response) => {
                    // Ya registrado, ahora hace login automático
                    const loginData = {
                    email: this.registerForm.value.email,
                    password: this.registerForm.value.password
                    };
                    console.log('Intentando login automático:', loginData);

                    this.authService.login(loginData).subscribe({
                    next: (loginResponse: any) => {
                    // Guardar token del login
                        console.log('Login exitoso:', loginResponse); 
                        console.log('Token recibido:', loginResponse.token); 
                        console.log('RefreshToken recibido:', loginResponse.refreshToken);
                        // Guardar token del login
                        localStorage.setItem('token', loginResponse.token);
                        localStorage.setItem('refreshToken', loginResponse.refreshToken || '');
                        localStorage.setItem('user', JSON.stringify(loginResponse.user));
                        console.log('Token guardado en localStorage:', localStorage.getItem('token')); // ⭐ Verificar que se guardó
        
                        this.showWelcomeMessage = true;
                        setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                                  }, 1500);
                                },
                                
                error: (loginError) => { 
                console.error('Error en login automático:', loginError);
                 // Si falla el login automático, redirige a login normal
                 this.router.navigate(['/login']);
                         }
                 });
                },
                error: (error) => {
                    console.log('Error:', error);
                    this.loading = false;
                    this.errorMessage = error.message || 'Error de conexión. Intente nuevamente.';
                    
                }
            });

        }else {
            this.markFormGroupTouched();
        };
    }
// Marca todos los campos del formulario como touched para mostrar errores
    private markFormGroupTouched(): void {
        Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
            control.markAsTouched();
        }
        });
    }
}
    


