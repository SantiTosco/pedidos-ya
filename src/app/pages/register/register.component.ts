import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../guards/auth.service';
import { of } from 'rxjs';


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
                //asyncValidators: [this.verifyEmailValidator(this.authService)],
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

    togglePassword(){
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword(){
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    redirectToDashboard(){  
        this.router.navigate(['/dashboard']);
    }

    onSubmit() {
        console.log('🔥 onSubmit ejecutado'); // ← Agrega esto
        
        if (this.registerForm.valid) {
            this.loading = true;
            this.errorMessage = '';
            
            const registerData = {
            email: this.registerForm.value.email,
            password: this.registerForm.value.password
            };
    
            console.log('📤 Enviando datos:', registerData); // ← Y esto            
            this.authService.register(registerData).subscribe({
                next: (response) => {
                    // Registro exitoso, ahora hacer login automático
                    const loginData = {
                    email: this.registerForm.value.email,
                    password: this.registerForm.value.password
                    };
                    console.log('🔑 Intentando login automático:', loginData); // ⭐ Agregar este log

                    this.authService.login(loginData).subscribe({
                    next: (loginResponse: any) => {
                    // Guardar token del login
                         console.log('✅ Login exitoso:', loginResponse); // ⭐ Agregar este log
                        console.log('🎫 Token recibido:', loginResponse.token); // ⭐ Verificar token
                        console.log('🔄 RefreshToken recibido:', loginResponse.refreshToken);
                        // Guardar token del login
                        localStorage.setItem('token', loginResponse.token);
                        localStorage.setItem('refreshToken', loginResponse.refreshToken || '');
                        localStorage.setItem('user', JSON.stringify(loginResponse.user));
                        console.log('💾 Token guardado en localStorage:', localStorage.getItem('token')); // ⭐ Verificar que se guardó
        
                        this.showWelcomeMessage = true;
                        setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                                  }, 1500);
                                },
                                
                error: (loginError) => { // ⭐ ¡Faltaba esto!
                console.error('❌ Error en login automático:', loginError);
                 // Si falla el login automático, redirigir a login normal
                 this.router.navigate(['/login']);
                         }
                 });
                },
                error: (error) => {
                    console.log('❌ Error recibido:', error); // ← Y esto
                    this.loading = false;
                    this.errorMessage = error.message || 'Error de conexión. Intente nuevamente.';
                    
                }
            });

        }else {
            this.markFormGroupTouched();
        };
    }

    private markFormGroupTouched(): void {
        Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
            control.markAsTouched();
        }
        });
    }

    verifyEmailValidator(authService: AuthService): AsyncValidatorFn {
        //Obtiene el mail ingresado en el formulario
        return (control: AbstractControl): Promise<ValidationErrors | null> => {
            const email = control.value;

            if (!email) return Promise.resolve(null); // No valida la existencia si el campo de mail está vacío

            return authService.findMails().then(mails => {
            return mails.includes(email) ? { emailExists: true } : null;
            });
        };
    }
}
    


