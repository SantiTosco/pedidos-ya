import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-order',
  imports: [CommonModule],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css'
})


export class CreateOrder {

  items: Array<{ image: string; name: string; price: number; quantity: number }> = [];  

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {
    this.initialization();
  }

  async initialization(): Promise<void> {
    try {
      const data = await this.apiService.getItemsOnCart();
      this.items = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  removeItem(itemName: string): void {
    const index = this.items.findIndex(item => item.name === itemName);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  updateQuantity(itemName: string, change: number): void {
    const item = this.items.find(item => item.name === itemName);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change); // No permite valores < 1
    }
  }

  getTotal():number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  goBack():void {
    this.router.navigate(['']);
  }

  clearCart(): void {
    this.items = [];
  }
}
