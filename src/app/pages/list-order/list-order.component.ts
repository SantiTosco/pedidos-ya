// Importaciones necesarias de Angular y servicios personalizados
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Interfaz que representa la estructura de un pedido
export interface Pedido {
  id: number;
  estado: string;
  restauranteId: number;
  deliveryId: number | null;
  productos: number[]; // IDs de productos en el pedido
  location: {
    cityId: number;
    number: string;
    street: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  usuarioId: number;
}

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css'],
  imports: [CommonModule], // Importa directivas comunes de Angular
  standalone: true // Componente independiente, no necesita módulo
})
export class ListOrderComponent implements OnInit {

  // Lista de pedidos del usuario actual
  pedidos: Pedido[] = [];

  // Variables para paginación
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10; // Cantidad de pedidos por página

  constructor(
    private pedidoService: PedidoService,
    private readonly router: Router,
  ) {}

  // Hook de ciclo de vida: se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.loadPedidos(); // Carga los pedidos del usuario actual
  }

  // Método que carga los pedidos paginados desde la API
  loadPedidos(): void {
    // Obtiene al usuario desde localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const usuarioId = user?.id;

    if (!usuarioId) {
      console.error('No se pudo obtener el ID del usuario desde el token');
      return;
    }

    // Llama al servicio para obtener los pedidos
    this.pedidoService.getPedidos(this.currentPage, this.limit).subscribe({
      next: (data) => {
        // Filtra solo los pedidos del usuario actual
        this.pedidos = data.items.filter((p: Pedido) => p.usuarioId === usuarioId);
        this.totalPages = data.meta.totalPages;
        this.currentPage = data.meta.currentPage;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
      }
    });
  }

  // Método opcional para mejorar rendimiento en bucles *ngFor
  trackById(index: number, pedido: Pedido): number {
    return pedido.id;
  }

  // Avanza una página, si no está en la última
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPedidos();
    }
  }

  // Retrocede una página, si no está en la primera
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPedidos();
    }
  }

  // Traduce el estado interno del pedido a un texto más legible para el usuario
  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'pending':
        return 'Pedido pendiente';
      case 'in_progress':
        return 'Pedido en proceso';
      case 'delivered':
        return 'Pedido entregado';
      default:
        return estado;
    }
  }

  // Navega de regreso al dashboard del usuario
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
