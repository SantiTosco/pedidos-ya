import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
    showPassword: boolean = false;
    
    constructor(private router: Router) {}

    togglePassword(){
        this.showPassword = !this.showPassword;
    }

    redirectToHome(){
        this.router.navigate(['']);
    }

    redirectToRegister(){
        this.router.navigate(['register']);
    }
}
