import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = "http://localhost:5000/api/products";
    
    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl).pipe(
            catchError((error) => {
                console.error("Error while fetching products", error);
                return this.http.get<Product[]>("assets/products.json");
            }),
            tap((products) => this._products.set(products)),
        );
    }

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.apiUrl, product).pipe(
            catchError((error) => {
                console.error("Error while creating product", error);
                return of(false);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product) {
        return this.http.put<boolean>(`${this.apiUrl}/${product._id}`, product).pipe(
            catchError((error) => {
                console.log("Error while updating product", error);
                return of(false);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p._id === product._id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/${productId}`).pipe(
            catchError((error) => {
                console.error("Error while deleting product", error);
                return of(false);
            }),
            tap(() => this._products.update(products => products.filter(product =>
                product._id !== productId)
            )),
        );
    }
}