import { Routes } from "@angular/router";
import { AuthGuard } from "./auth/data-access/auth.guard";
import { HomeComponent } from "./shared/features/home/home.component";
import { CartComponent } from "./cart/features/cart-component/cart.component";
import { LoginComponent } from "./auth/features/auth-form/login-form.component";
import { ContactFormComponent } from "./contact/features/contact-form-component/contact-form.component";
import { RegisterFormComponent } from "./auth/features/auth-form/register-form.component";

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterFormComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "contact",
    component: ContactFormComponent
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
];

console.log(APP_ROUTES);
