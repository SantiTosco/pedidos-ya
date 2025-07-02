import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService} from '../../services/usuario.service';
import { RouterModule } from '@angular/router'; // ✅ Agregar para routerLink

// ✅ Definir interfaces según tu entidad real
interface User {
  id: number;
  email: string;
  roles?: any[]; // Opcional si quieres mostrar roles
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
    RouterModule // ✅ Agregar RouterModule para routerLink
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
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''] // Opcional para cambiar contraseña
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        this.profileForm.patchValue({
          email: user.email,
          password: '' // Siempre vacío por seguridad
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.showMessage('Error al cargar el perfil', 'error');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      
      const formData = this.profileForm.value;
      const updateData: UpdateUserProfile = {};

      // Solo incluir campos que han cambiado
      if (formData.email !== this.user?.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      if (Object.keys(updateData).length === 0) {
        this.showMessage('No hay cambios para guardar', 'error');
        this.loading = false;
        return;
      }

      this.userService.updateProfile(updateData).subscribe({
        next: (updatedUser: User) => {
          this.user = updatedUser;
          this.showMessage('Perfil actualizado correctamente', 'success');
          this.profileForm.patchValue({ password: '' }); // Limpiar contraseña
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.showMessage('Error al actualizar el perfil', 'error');
          this.loading = false;
        }
      });
    }
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }
}