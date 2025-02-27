import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'app/auth/data-access/auth.service';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { NotificationService } from 'app/notification.service';

@Component({
  selector: 'app-login',
  template: `
        <div class="flex flex-col items-center p-4">
          <h2 class="text-xl font-bold">Inscription</h2>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div>
                  <label>Nom d'utilisateur</label>
                  <input type="text" formControlName="username">
              </div>

              <div>
                  <label>Prénom</label>
                  <input type="text" formControlName="firstname">
              </div>

              <div>
                  <label>Email</label>
                  <input type="email" formControlName="email">
              </div>

              <div>
                  <label>Mot de passe</label>
                  <input type="password" formControlName="password">
              </div>

              <button type="submit" [disabled]="registerForm.invalid">S'inscrire</button>

              <p *ngIf="errorMessage" style="color: red;">{{ errorMessage }}</p>

              <p>Déjà un compte ? <a (click)="navigateToLogin()">Se connecter</a></p>
          </form>
          <div *ngIf="notificationMessage" class="notification">{{ notificationMessage }}</div>
        </div>
  `,
  styleUrls: ["./register-form.component.scss"],
  standalone: true,
  imports: [FormsModule, PasswordModule, CommonModule, ReactiveFormsModule],
})
export class RegisterFormComponent {
    registerForm: FormGroup;
    errorMessage: string | null = null;
    notificationMessage: string = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  
  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.notificationService.showNotification('Inscription réussie, veuillez vous connecter.'); 
          this.router.navigate(['/login']); 
        }, 
        error: err => this.errorMessage = err.error.message || 'Inscription échouée'
      });
    }
  }
}