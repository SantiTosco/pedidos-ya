import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { User } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
 mostrarMensaje = true;
 mostrarFade = false;
 items: Array<{ image: string; name: string; description: string }> = [];
 user: User | null = null;
showLogoutMessage: boolean = false;
showLoginMessage: boolean = true;

  constructor(
    private readonly apiService: ApiService,
    private readonly globalStatusService: GlobalStatusService,
    private readonly router: Router
  ) {}

  goToOrders(): void {
    this.router.navigate(['/list-order']);
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']); // ✅ nueva función para navegar al perfil
  }
  logOut(): void {
    const confirmLogout = confirm('¿Estás seguro de que querés cerrar sesión?');

    if (confirmLogout){
  // Limpiar todos los datos de sesión

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken'); // Si usás refresh token
  
  // También limpiar sessionStorage por si acaso
    sessionStorage.clear();
  
  // Resetear variables del componente
    this.user = null;
  
  // ⭐ Mostrar mensaje
      this.showLogoutMessage = true;
      
      // ⭐ Ocultar mensaje después de 3 segundos y redirigir
      setTimeout(() => {
      this.showLogoutMessage = false;
      
      // ⭐ Esperar más tiempo para que el fade sea más visible
      setTimeout(() => {
        this.router.navigate(['']);
      }, 800); // 800ms para que termine el fade lento
    }, 4000); // 4 segundos mostrando el mensaje
    }
  }

  ngOnInit(): void {
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    this.initialization();
    if (justLoggedIn === 'true') {
      this.showLoginMessage = true;
       // Limpiar la marca
      localStorage.removeItem('justLoggedIn');

    setTimeout(() => {
      this.mostrarFade = true;
    }, 10);

    setTimeout(() => {
      this.mostrarFade = false;

    setTimeout(() => {
        this.mostrarMensaje = false;
      }, 500); // coincide con la duración del CSS
    }, 3000);
    
    }
  }
  async initialization(): Promise<void> {
    try {
      this.globalStatusService.setLoading(true);
      const data = await this.apiService.getData();
      this.items = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.globalStatusService.setLoading(false);
    }
  }
}