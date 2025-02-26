import {
  Component,
} from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { AuthService } from "./auth/data-access/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule],
})
export class AppComponent {
  public isLoggedIn: boolean = false;
  title = "ALTEN SHOP";

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onCartClick() {
    console.log("Cart clicked");
    this.router.navigate(["/cart"]);
  }

  onLoginClick() {
    console.log("Login clicked");
    this.router.navigate(['/login']);
  }

    onLogoutClick() {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
