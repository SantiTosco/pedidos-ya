import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GlobalStatusService } from '../../services/global-status.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  
})

export class HomeComponent implements OnInit {
  items: Array<{ image: string; name: string; description: string }> = [];
  constructor(
    private readonly apiService: ApiService,
    private readonly globalStatusService: GlobalStatusService,
    private readonly router: Router
  ) {}

  goToOrders(): void {
    this.router.navigate(['/list-order']);

}

  ngOnInit(): void {
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
