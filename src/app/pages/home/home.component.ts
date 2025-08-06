// Importación de módulos y servicios necesarios
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; 
import { GlobalStatusService } from '../../services/global-status.service'; 
import { Router } from '@angular/router'; 

// Decorador del componente
@Component({
  selector: 'app-home',
  imports: [], // No se importan módulos porque este componente no es standalone
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  // Lista de ítems (productos, restaurantes, etc.) que se muestran como cards
  items: Array<{ image: string; name: string; description: string }> = [];

  // Constructor con inyección de servicios
  constructor(
    private readonly apiService: ApiService,
    private readonly globalStatusService: GlobalStatusService, 
    private readonly router: Router 
  ) {}

  // Navega a la pantalla de inicio de sesión
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Navega a la pantalla de registro
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Hook que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.initialization(); // Llama a la función que carga los datos
  }

  // Función asincrónica que obtiene los datos desde la API
  async initialization(): Promise<void> {
    try {
      this.globalStatusService.setLoading(true);
      const data = await this.apiService.getData(); // Llama a la API
      this.items = data;
    } catch (error) {
      console.error('Error fetching data:', error); // Log de error en consola
    } finally {
      this.globalStatusService.setLoading(false); // Oculta el loading, siempre
    }
  }
}
