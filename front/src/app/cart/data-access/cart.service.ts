import { Injectable, signal, inject } from "@angular/core";
import { Product } from "../../products/data-access/product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { Cart, CartItem } from "./cart.model";

@Injectable({
    providedIn: "root"
})
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly path = "/api/cart";

    private readonly _cart = signal<Cart>({ id: "", items: [] });
    public readonly cart = this._cart.asReadonly();

    /** Récupérer le panier depuis l'API */
    public getCart(): Observable<Cart> {
        return this.http.get<Cart>(this.path).pipe(
            catchError(() => of({ id: "", items: [] })), 
            tap(cart => this._cart.set(cart))
        );
    }

    /** Ajouter un produit au panier */
    public addToCart(product: Product, quantity: number = 1): Observable<boolean> {
        return this.http.post<boolean>(this.path, { productId: product.id, quantity }).pipe(
            catchError(() => of(true)),
            tap(() => {
                this._cart.update(cart => {
                    const existingItem = cart.items.find(item => item.product.id === product.id);
                    if (existingItem) {
                        return {
                            ...cart,
                            items: cart.items.map(item =>
                                item.product.id === product.id
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

    /** Modifier la quantité d'un produit dans le panier */
    public updateQuantity(productId: number, quantity: number): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${productId}`, { quantity }).pipe(
            catchError(() => of(true)),
            tap(() => {
                this._cart.update(cart => ({
                    ...cart,
                    items: cart.items.map(item =>
                        item.product.id === productId ? { ...item, quantity } : item
                    )
                }));
            })
        );
    }

    /** Supprimer un produit du panier */
    public removeFromCart(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe( 
            catchError(() => of(true)),
            tap(() => {
                this._cart.update(cart => ({
                    ...cart,
                    items: cart.items.filter(item => item.product.id !== productId)
                }));
            })
        );
    }

    /** Vider entièrement le panier */
    public clearCart(): Observable<boolean> {
        return this.http.delete<boolean>(this.path).pipe(
            catchError(() => of(true)),
            tap(() => this._cart.set({ id: "", items: [] }))
        );
    }
}
