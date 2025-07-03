import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
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
    errorMessage = '';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.registerForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
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
                    console.log('✅ Respuesta recibida:', response); // ← Y esto
                    this.loading = false;
                    this.redirectToDashboard();
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
    }
    


