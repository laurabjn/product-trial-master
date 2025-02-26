import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

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

  logout() {
    localStorage.removeItem('token'); 
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); 
    }
    
    getAuthStatus(): Observable<boolean> {
        return this.authStatus.asObservable();
    }
}