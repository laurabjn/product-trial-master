import { Component, OnInit, inject } from "@angular/core";
import { CartService } from "app/cart/data-access/cart.service";
import { CartItem } from "app/cart/data-access/cart.model";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  standalone: true,
  imports: [TableModule, ButtonModule, InputNumberModule],
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  public readonly cart = this.cartService.cart;

  ngOnInit() {
    this.cartService.getCart().subscribe();
  }

  /** Modifier la quantité d'un produit */
  public updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return; // Empêcher une quantité négative
    this.cartService.updateQuantity(item.product.id, quantity).subscribe();
  }

  /** Supprimer un produit du panier */
  public removeItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe();
  }

  /** Vider tout le panier */
  public clearCart() {
    this.cartService.clearCart().subscribe();
  }

  /** Calculer le total du panier */
  public getTotal(): number {
    return this.cart()?.items.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0;
  }
}
