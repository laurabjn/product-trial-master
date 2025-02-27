import { Injectable, signal, inject } from "@angular/core";
import { Product } from "../../products/data-access/product.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { Cart, CartItem } from "./cart.model";
import { AuthService } from "app/auth/data-access/auth.service";

@Injectable({
    providedIn: "root"
})
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly path = "http://localhost:5000/api/cart";

    private readonly _cart = signal<Cart>({ id: "", items: [] });
    public readonly cart = this._cart.asReadonly();

    public getCart(): Observable<Cart> {
        console.log("getCart");
        return this.http.get<Cart>(this.path).pipe(
            catchError(() => of({ id: "", items: [] })), 
            tap(cart => this._cart.set(cart))
        );
    }

    public addToCart(product: Product, quantity: number = 1, userId: string): Observable<boolean> {
        if (!userId) {
            console.error("User ID is not available");
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}` 
          });
        
        console.log("addToCart", product, quantity);
        return this.http.post<boolean>(this.path, { productId: product._id, quantity, userId }, { headers }).pipe(
            catchError(() => of(true)),
            tap(() => {
                this._cart.update(cart => {
                    const existingItem = cart.items.find(item => item.product._id === product._id);
                    if (existingItem) {
                        return {
                            ...cart,
                            items: cart.items.map(item =>
                                item.product._id === product._id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            )
                        };
                    } else {
                        return {
                            ...cart,
                            items: [...cart.items, { product, quantity }]
                        };
                    }
                });
            })
        );
    }

    public updateQuantity(productId: number, quantity: number): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${productId}`, { quantity }).pipe(
            catchError(() => of(true)),
            tap(() => {
                this._cart.update(cart => ({
                    ...cart,
                    items: cart.items.map(item =>
                        item.product._id === productId ? { ...item, quantity } : item
                    )
                }));
            })
        );
    }

    public removeFromCart(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe( 
            catchError(() => of(true)),
            tap(() => {
                this._cart.update(cart => ({
                    ...cart,
                    items: cart.items.filter(item => item.product._id !== productId)
                }));
            })
        );
    }

    public clearCart(): Observable<boolean> {
        return this.http.delete<boolean>(this.path).pipe(
            catchError(() => of(true)),
            tap(() => this._cart.set({ id: "", items: [] }))
        );
    }
}
