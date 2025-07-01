import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = null; // ✅ Ahora la propiedad sí existe

  ngOnInit(): void {
    const datosGuardados = localStorage.getItem('usuario');
    if (datosGuardados) {
      this.usuario = JSON.parse(datosGuardados);
    }
  }
}


