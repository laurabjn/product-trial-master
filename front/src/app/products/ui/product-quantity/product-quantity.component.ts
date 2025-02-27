import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-product-quantity',
  template: `
    <div class="product-quantity">
      <button (click)="decrease()" [disabled]="quantity <= min">-</button>
      <input type="number" [(ngModel)]="quantity" [max]="max" [min]="min" />
      <button (click)="increase()" [disabled]="quantity >= max">+</button>
    </div>
  `,
  styleUrls: ["./product-quantity.component.scss"],
  standalone: true,
  imports: [FormsModule],
})
export class ProductQuantityComponent {
  @Input() quantity: number = 1;
  @Input() min: number = 1;
  @Input() max: number = 10;
  @Output() quantityChange = new EventEmitter<number>();

  increase() {
    if (this.quantity < this.max) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  decrease() {
    if (this.quantity > this.min) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  update(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    if (value >= this.min && value <= this.max) {
      this.quantity = value;
      this.quantityChange.emit(this.quantity);
    }
  }
}
