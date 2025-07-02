import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GlobalStatusService } from '../../services/global-status.service';

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

  ngOnInit(): void {
    setTimeout(() => {
      this.mostrarFade = true;
    }, 10);

    setTimeout(() => {
      this.mostrarFade = false;

    setTimeout(() => {
        this.mostrarMensaje = false;
      }, 500); // coincide con la duración del CSS
    }, 3000);
    
    this.initialization();
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