// Importaciones necesarias para el componente
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// Decorador que define los metadatos del componente
@Component({
  selector: 'app-create-order',
  imports: [CommonModule],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css'
})


// Clase del componente que gestiona la creación del pedido
export class CreateOrder {

  // Lista de ítems del carrito con su imagen, nombre, precio y cantidad
  items: Array<{ image: string; name: string; price: number; quantity: number }> = [];


  // Constructor: inyecta el servicio de API y el router, e inicializa el componente
  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {
    this.initialization(); // Se llama al método para cargar los datos del carrito
  }


  // Método que obtiene los ítems del carrito desde la API
  async initialization(): Promise<void> {
    try {
      const data = await this.apiService.getItemsOnCart(); // Llama al servicio y espera la respuesta
      this.items = data; // Asigna los datos obtenidos a la propiedad 'items'
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  // Elimina un ítem del carrito según su nombre
  removeItem(itemName: string): void {
    const index = this.items.findIndex(item => item.name === itemName); // Busca el índice del ítem
    if (index !== -1) {
      this.items.splice(index, 1); // Lo elimina si fue encontrado
    }
  }


  // Actualiza la cantidad de un ítem sumando o restando, pero no permite valores menores a 1
  updateQuantity(itemName: string, change: number): void {
    const item = this.items.find(item => item.name === itemName);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
    }
  }


  // Calcula el total del pedido (suma del precio * cantidad de cada ítem)
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Navega hacia la ruta raíz (pantalla anterior o inicio)
  goBack(): void {
    this.router.navigate(['']);
  }


  // Limpia completamente el carrito
  clearCart(): void {
    this.items = [];
  }
}
