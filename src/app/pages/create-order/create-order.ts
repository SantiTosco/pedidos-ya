import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


interface Item {
  image: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-create-order',
  imports: [CommonModule],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css'
})


export class CreateOrder {

  //items: Array<{ image: string; name: string; price: number; quantity: number }> = [];  
  items: Item[] = [
    {
      image: 'https://www.laespanolaaceites.com/wp-content/uploads/2019/06/pizza-margarita-1080x671.jpg',
      name: 'Pizza Margherita',
      price: 10.99,
      quantity: 1
    },
    {
      image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcREaic2Cr3jjwQWZwOVoDQNdOFaOe8cSuAPvXNqNDZIjS96nTd-l6g_PI7lYxE1iGpTFz5iyGKyM6D-UvZC_TmRRCc1utE9Tr-aa_uy7A',
      name: 'Spaghetti Carbonara',
      price: 12.99,
      quantity: 2
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjfFdDuNiSRq-9lzAw9NVEdgiMfXQf0TSAm96JNrQ3tDg-D7SiWciYkmlrAVpsJ7mSjswWMN-nOB0mHdYSRsVPKsPaB4wdSNTfRX9P1g',
      name: 'Caesar Salad',
      price: 8.99,
      quantity: 1
    }
  ];

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {
    this.initialization();
  }

  /*async initialization(): Promise<void> {
    try {
      const data = await this.apiService.getData();
      this.items = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }*/
  initialization(): void {}

  removeItem(itemName: string): void {
    const index = this.items.findIndex(item => item.name === itemName);
    if (index) {
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
