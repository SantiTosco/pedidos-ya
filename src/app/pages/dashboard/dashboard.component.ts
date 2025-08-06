// Importaciones necesarias para el componente
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { User } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard', // Selector usado en la plantilla HTML
  standalone: true, // El componente es standalone (no requiere NgModule)
  imports: [CommonModule], // Importa CommonModule para usar directivas como *ngIf, *ngFor
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
 // Variables para mostrar mensajes en pantalla
  mostrarMensaje = true;
  mostrarFade = false;

  // Lista de ítems que se mostrarán en cards
  items: Array<{ image: string; name: string; description: string }> = [];

  // Información del usuario
  user: User | null = null;

  // Estado de los mensajes de login/logout
  showLogoutMessage: boolean = false;
  showLoginMessage: boolean = true;

  // Constructor con inyección de dependencias
  constructor(
    private readonly apiService: ApiService,
    private readonly globalStatusService: GlobalStatusService,
    private readonly router: Router
  ) {}

  // Método de Angular que se ejecuta al inicializar el componente
  ngOnInit(): void {
    const justLoggedIn = localStorage.getItem('justLoggedIn'); // Marca temporal para mostrar el mensaje de bienvenida

    this.initialization();

    // Si el usuario acaba de iniciar sesión
    if (justLoggedIn === 'true') {
      this.showLoginMessage = true;
      localStorage.removeItem('justLoggedIn'); // Elimina la marca para no mostrar el mensaje de nuevo

      // Simula el fade del mensaje "Bienvenido"
      setTimeout(() => {
        this.mostrarFade = true;
      }, 10);

      setTimeout(() => {
        this.mostrarFade = false;

        setTimeout(() => {
          this.mostrarMensaje = false; // Oculta completamente el mensaje
        }, 500);
      }, 3000);
    }
  }

  // Método para obtener los datos desde la API
  async initialization(): Promise<void> {
    try {
      this.globalStatusService.setLoading(true); // Muestra spinner o loading global
      const data = await this.apiService.getData(); // Llama a la API
      this.items = data; // Guarda los ítems obtenidos
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.globalStatusService.setLoading(false); // Oculta loading
    }
  }

  // Navega a la vista de pedidos del usuario
  goToOrders(): void {
    this.router.navigate(['/list-order']);
  }

  // Navega al perfil del usuario
  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  // Cierra la sesión del usuario
  logOut(): void {
    const confirmLogout = confirm('¿Estás seguro de que querés cerrar sesión?');

    if (confirmLogout) {
      // Elimina los datos del almacenamiento local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken'); // Si usas refresh tokens

      sessionStorage.clear(); // Limpieza adicional por las dudas

      this.user = null; // Resetea el usuario en memoria

      this.showLogoutMessage = true; // Muestra mensaje de "Sesión cerrada"

      // Oculta mensaje
      setTimeout(() => {
        this.showLogoutMessage = false;

        // Da tiempo para ver el efecto fade y redirige al home
        setTimeout(() => {
          this.router.navigate(['']);
        }, 800);
      }, 4000);
    }
  }
}