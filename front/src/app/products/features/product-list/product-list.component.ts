import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { Product } from "app/products/data-access/product.model";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ProductQuantityComponent } from "app/products/ui/product-quantity/product-quantity.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from "app/auth/data-access/auth.service";
import { ProductsService } from "app/products/data-access/products.service";
import { CartService } from "app/cart/data-access/cart.service";
import { NotificationService } from "app/notification.service";

const emptyProduct: Product = {
  _id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    ProductQuantityComponent,
    CommonModule,
    ToastModule,
    PaginatorModule,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  public readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService)

  // public readonly products = this.productsService.products;
  public readonly products = signal<Product[]>([]);

  public isCartDialogVisible = false;
  public isAdmin = false;
  public isDialogVisible = false;
  public isCreation = false;
  public selectedProduct = signal<Product | null>(null);
  public selectedQuantity = signal<number>(1);
  public readonly editedProduct = signal<Product>(emptyProduct);

  public pageSize = 5;
  public totalProducts = 0;
  public currentPage = 0;

  ngOnInit() {
    this.productsService.get().subscribe(products => {
      this.totalProducts = products.length; 
      this.products.set(products.slice(0, this.pageSize)); 
    });
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.isAdmin ?? false;
  }

  public onPageChange(event: any) {
    this.currentPage = event.page;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.products.set(this.productsService.products().slice(start, end)); 
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product._id).subscribe();
  }

  public addToCart(product: Product) {
    this.selectedProduct.set(product);
    this.selectedQuantity.set(1); 
    this.isCartDialogVisible = true;
  }

  public confirmAddToCart() {
    const product = this.selectedProduct();
    const quantity = this.selectedQuantity();
  
    if (product) {
      this.cartService.addToCart(product, quantity).subscribe(() => {
        this.notificationService.showSuccess(`${product.name} a été ajouté au panier.`);
        this.closeCartDialog();
      });
    }
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public closeCartDialog() {
    this.isCartDialogVisible = false;
  }
}
