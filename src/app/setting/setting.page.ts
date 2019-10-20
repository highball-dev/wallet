import { Component, OnInit } from "@angular/core";
import { AuthService } from "../service/auth.service";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.page.html",
  styleUrls: ["./setting.page.scss"]
})
export class SettingPage implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {}

  logout() {
    this.auth.logout();
  }
}
