import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../guards/auth.service';

// ✅ Interfaces simplificadas - solo email y password
interface User {
  id: number;
  email: string;
  roles?: any[];
}

interface UpdateUserProfile {
  email?: string;
  password?: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    // ✅ FormGroup con validaciones de contraseña mínima 6 caracteres
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]  // Mínimo 6 caracteres
    });
  }

  ngOnInit(): void {
    this.loading = true;

    // Obtener del localStorage como respaldo
    const userFromStorage = this.authService.getCurrentUser();
    if (userFromStorage) {
      console.log('👤 Usuario desde localStorage:', userFromStorage);
      this.user = userFromStorage;
      this.populateForm(userFromStorage);
    }

    // Hacer petición al backend para datos actualizados
    this.userService.getProfile().subscribe({
      next: (response) => {
        console.log('👤 Usuario desde API:', response);
        
        // ✅ Verificar si la respuesta es válida
        if (response && response.email) {
          this.user = response;
          this.populateForm(response);
        } else {
          console.warn('⚠️ API devolvió datos inválidos, usando localStorage');
          // Si API no devuelve datos válidos, usar localStorage
          if (userFromStorage) {
            this.user = userFromStorage;
            this.populateForm(userFromStorage);
          } else {
            this.showMessage('No se pudieron cargar los datos del usuario', 'error');
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener perfil:', error);
        
        // ✅ Si hay error en API, usar localStorage como respaldo
        if (userFromStorage) {
          console.log('🔄 Usando datos de localStorage como respaldo');
          this.user = userFromStorage;
          this.populateForm(userFromStorage);
          this.showMessage('Usando datos guardados localmente', 'success');
        } else {
          this.showMessage('Error al cargar el perfil', 'error');
        }
        this.loading = false;
      }
    });
  }

  // ✅ Método para llenar el formulario - con validación null
  private populateForm(user: User | null): void {
    if (!user || !user.email) {
      console.warn('⚠️ No se puede llenar el formulario: usuario inválido', user);
      return;
    }
  
    this.profileForm.patchValue({
      email: user.email,
      password: '' // Siempre vacío por seguridad
    });
  }
  
  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      this.loading = true;
      
      const formData = this.profileForm.value;
      const updateData: UpdateUserProfile = {};

      // ✅ Solo comparar email y password
      if (formData.email !== this.user.email) {
        // ✅ Validar que el email no exista en la DB
        this.userService.checkEmailExists(formData.email, this.user.id).subscribe({
          next: (emailExists) => {
            if (emailExists) {
              this.showMessage('Este email ya está registrado', 'error');
              this.loading = false;
              return;
            }
            
            updateData.email = formData.email;
            this.proceedWithUpdate(updateData, formData);
          },
          error: (error) => {
            console.error('Error checking email:', error);
            this.showMessage('Error al validar el email', 'error');
            this.loading = false;
          }
        });
      } else {
        this.proceedWithUpdate(updateData, formData);
      }
    } else {
      // ✅ Marcar todos los campos como touched para mostrar errores
      this.profileForm.markAllAsTouched();
      this.showMessage('Por favor completa todos los campos requeridos', 'error');
    }
  }

  private proceedWithUpdate(updateData: UpdateUserProfile, formData: any): void {
  if (formData.password && formData.password.trim() !== '') {
    updateData.password = formData.password;
  }

  if (Object.keys(updateData).length === 0) {
    this.showMessage('No hay cambios para guardar', 'error');
    this.loading = false;
    return;
  }

  this.userService.updateProfile(updateData).subscribe({
    next: (response: any) => { // ⭐ Cambiar de 'updatedUser: User' a 'response: any'
      console.log('Respuesta del servidor:', response);
      
      // ⭐ NUEVO: Verificar si viene un nuevo token (cambio de email)
      if (response.access_token) {
        // Actualizar el token en localStorage
        localStorage.setItem('token', response.access_token);
        console.log('🔄 Token actualizado por cambio de email');
        
        // Actualizar los datos del usuario con el objeto user de la respuesta
        this.user = response.user;
        this.populateForm(response.user);
        
        this.showMessage(response.message || 'Email actualizado correctamente.', 'success');
      } else {
        // Es una actualización normal (sin cambio de email)
        this.user = response; // response es directamente el User
        this.populateForm(response);
        this.showMessage('Perfil actualizado correctamente', 'success');
      }
      
      // ✅ Limpiar solo la contraseña
      this.profileForm.patchValue({ password: '' });
      this.loading = false;
    },
    error: (error) => {
      console.error('Error updating profile:', error);
      this.showMessage('Error al actualizar el perfil', 'error');
      this.loading = false;
    }
  });
}

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }
}