import {
  Component,
} from "@angular/core";
import { Router } from "@angular/router";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent],
})
export class AppComponent {

  constructor(private router: Router) { }
  
  title = "ALTEN SHOP";

  onCartClick() {
    console.log("Cart clicked");
    this.router.navigate(["/cart"]);
  }
}
