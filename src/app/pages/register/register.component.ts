import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    showPassword: boolean = false;

    constructor(private router: Router) {}

    togglePassword(){
        this.showPassword = !this.showPassword;
    }

    redirectToHome(){
        this.router.navigate(['']);
    }
}

