import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product } from "app/products/data-access/product.model";
import { SelectItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: "app-product-form",
  template: `
    <form #form="ngForm" (ngSubmit)="onSave()">
      <div class="form-field">
        <label for="code">Code</label>
        <input pInputText
          type="text"
          id="code"
          name="code"
          [(ngModel)]="editedProduct().code"
          required>
      </div>
      <div class="form-field">
        <label for="name">Nom</label>
        <input pInputText
          type="text"
          id="name"
          name="name"
          [(ngModel)]="editedProduct().name"
          required>
      </div>
      <div class="form-field">
        <label for="price">Prix</label>
        <p-inputNumber 
          [(ngModel)]="editedProduct().price" 
          name="price"
          mode="decimal"
          required/> 
      </div>
      <div class="form-field">
        <label for="quantity">Quantité</label>
        <p-inputNumber 
          [(ngModel)]="editedProduct().quantity" 
          name="quantity"
          mode="decimal"
          required/>
      </div>
      <div class="form-field">
        <label for="image">Image URL</label>
        <input pInputText
          type="text"
          id="image"
          name="image"
          [(ngModel)]="editedProduct().image"
          required>
      </div>
      <div class="form-field">
        <label for="description">Description</label>
        <textarea pInputTextarea 
          id="description"
          name="description"
          rows="5" 
          cols="30" 
          [(ngModel)]="editedProduct().description">
        </textarea>
      </div>      
      <div class="form-field">
        <label for="category">Catégorie</label>
        <p-dropdown 
          [options]="categories" 
          [(ngModel)]="editedProduct().category" 
          name="category"
          appendTo="body"
          required
        />
      </div>
      <div class="form-field">
        <label for="internalReference">Référence Interne</label>
        <input pInputText
          type="text"
          id="internalReference"
          name="internalReference"
          [(ngModel)]="editedProduct().internalReference"
          required>
      </div>
      <div class="form-field">
        <label for="shellId">Shell ID</label>
        <p-inputNumber 
          [(ngModel)]="editedProduct().shellId" 
          name="shellId"
          mode="decimal"
          required/>
      </div>
      <div class="form-field">
        <label for="inventoryStatus">État de l'inventaire</label>
        <p-dropdown 
          [options]="inventoryStatusOptions" 
          [(ngModel)]="editedProduct().inventoryStatus" 
          name="inventoryStatus"
          appendTo="body"
          required
        />
      </div>
      <div class="form-field">
        <label for="rating">Évaluation</label>
        <p-inputNumber 
          [(ngModel)]="editedProduct().rating" 
          name="rating"
          mode="decimal"
          required/>
      </div>
      <div class="flex justify-content-between">
        <p-button type="button" (click)="onCancel()" label="Annuler" severity="help"/>
        <p-button type="submit" [disabled]="!form.valid" label="Enregistrer" severity="success"/>
      </div>
    </form>
  `,
  styleUrls: ["./product-form.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductFormComponent {
  public readonly product = input.required<Product>();

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  public readonly editedProduct = computed(() => ({ ...this.product() }));

  public readonly categories: SelectItem[] = [
    { value: "Accessories", label: "Accessories" },
    { value: "Fitness", label: "Fitness" },
    { value: "Clothing", label: "Clothing" },
    { value: "Electronics", label: "Electronics" },
  ];

  public readonly inventoryStatusOptions: SelectItem[] = [
    { value: "INSTOCK", label: "In Stock" },
    { value: "LOWSTOCK", label: "Low Stock" },
    { value: "OUTOFSTOCK", label: "Out of Stock" },
  ];

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    const productToSave = {
      ...this.editedProduct(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.save.emit(productToSave);
  }
}
