import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthResponse } from './auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private jwtHelper = new JwtHelperService();
    private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
    private readonly apiUrl = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient, private router: Router) { }
    
    register(userData: { username: string; firstname: string; email: string; password: string }): Observable<AuthResponse | null> { 
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
        tap((response: AuthResponse) => {
            if (response) {
                console.log('Account created successfully', response);
            }
        }),
        catchError((error) => {
            console.error('Error during registration', error);
            return of(null);
        })
        );
    }

    login(email: string, password: string): Observable<AuthResponse | null> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
        tap((response: AuthResponse) => {
            // Saves the authentication token to local storage
            if (response) {
                console.log('Token received', response.token);
                localStorage.setItem('token', response.token);
            }
        }),
        catchError((error) => {
            console.error('Error during login', error);
            return of(null);
        })
        );
    }

    getToken(): string | null {
        return localStorage.getItem("token");
    }

    getCurrentUser(): { userId: string; isAdmin: boolean } | null {
        const token = this.getToken();
        
        if (!token) return null;
    
        try {
          const decodedToken: any = this.jwtHelper.decodeToken(token);
            return {
                userId: decodedToken.userId,
                isAdmin: decodedToken.isAdmin
            };
        } catch (error) {
          console.error("Erreur lors du décodage du token:", error);
          return null;
        }
    }

    logout() {
        localStorage.removeItem('token'); 
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token'); 
    }
    
    getAuthStatus(): Observable<boolean> {
        return this.authStatus.asObservable();
    }
}