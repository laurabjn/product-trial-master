import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AuthService } from 'app/auth/data-access/auth.service';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  template: `
    <div class="flex justify-content-center align-items-center h-screen">
        <div class="card p-4 shadow-3 border-round-lg w-25">
            <h2 class="text-center">Connexion</h2>
            <form (ngSubmit)="onSubmit()">
                <div class="p-field">
                    <label for="email">Email</label>
                    <input pInputText id="email" type="email" [(ngModel)]="email" name="email" required class="p-inputtext-lg w-full" />
                </div>

                <div class="p-field">
                    <label for="password">Mot de passe</label>
                    <p-password id="password" [(ngModel)]="password" name="password" required class="w-full" toggleMask inputStyleClass="p-inputtext-sm" [feedback]="false"></p-password>
                </div>

                <div class="flex justify-content-between align-items-center mt-3">
                    <button pButton type="submit" label="valider" icon="pi pi-sign-in" class="p-button-lg w-full">Valider</button>
                </div>

                <div *ngIf="errorMessage" class="p-mt-2 text-red-500">
                  {{ errorMessage }}
                </div>

                <p class="text-center mt-3">
                  Pas encore de compte ?
                  <a (click)="navigateToRegister()" class="text-blue-500 cursor-pointer">Inscrivez-vous ici</a>
                </p>
            </form>
        </div>
    </div>
  `,
  styleUrls: ["./login-form.component.scss"],
  standalone: true,
  imports: [FormsModule, PasswordModule, CommonModule],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }
  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.errorMessage = null;

    this.authService.login(this.email, this.password).subscribe((response) => {
        if (response) {
          window.location.reload();
          this.router.navigate(['/']);
        } else {
          this.errorMessage = "Identifiants incorrects.";
        }
    });
  }
}