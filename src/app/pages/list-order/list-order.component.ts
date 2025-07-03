import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router'


export interface Pedido {
  id: number;
  estado: string;
  restauranteId: number;
  deliveryId: number | null;
  productos: number[];
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
  imports: [CommonModule],
  standalone:true
})
export class ListOrderComponent implements OnInit{
  
  pedidos: Pedido[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  constructor(
    private pedidoService: PedidoService,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const usuarioId = user?.id;

      if (!usuarioId) {
        console.error('No se pudo obtener el ID del usuario desde el token');
        return;
      }

      this.pedidoService.getPedidos(this.currentPage, this.limit).subscribe({
        next: (data) => {
          this.pedidos = data.items.filter((p: Pedido) => p.usuarioId === usuarioId);
          this.totalPages = data.meta.totalPages;
          this.currentPage = data.meta.currentPage;
        },
        error: (err) => {
          console.error('Error al cargar pedidos:', err);
        }
      });
    }
  

  trackById(index: number, pedido: Pedido): number {
    return pedido.id;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPedidos();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPedidos();
    }
  }
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
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}