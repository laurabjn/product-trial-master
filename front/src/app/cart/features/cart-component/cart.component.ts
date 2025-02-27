import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
  imports: [TableModule, ButtonModule, InputNumberModule, FormsModule],
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  public readonly cart = this.cartService.cart;

  ngOnInit() {
    this.cartService.getCart().subscribe();
  }

  public updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return; // Prevent negative quantities
    this.cartService.updateQuantity(item.product._id, quantity).subscribe();
  }

  public removeItem(item: CartItem) {
    console.log("removeItem", item);
    console.log("Product ID:", item.product._id);
    this.cartService.removeFromCart(item.product._id).subscribe();
  }

  public clearCart() {
    this.cartService.clearCart().subscribe();
  }

  public getTotal(): number {
    return this.cart()?.items.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0;
  }
}
