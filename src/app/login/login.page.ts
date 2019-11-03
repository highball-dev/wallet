import { Component, OnInit } from "@angular/core";
import { NavController, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { AuthService } from "../service/auth.service";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public alertController: AlertController,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(""),
      password: new FormControl("")
    });
  }

  // signIn() {
  //   const email = this.loginForm.get("email").value;
  //   const password = this.loginForm.get("password").value;
  //   this.auth
  //     .login(email, password)
  //     .then(() => {
  //       this.router.navigate(["tabs"]);
  //     })
  //     .catch((error: any) => {
  //       if (error && error.code === "auth/user-not-found") {
  //         this.auth.siginUp(email, password).then(() => {
  //           console.log("CREATE");
  //           this.router.navigate(["tabs"]);
  //         });
  //       }
  //     });
  // }

  signInWithGoogle() {
    this;
    this.auth.signinWithGoogle().then(() => {
      this.router.navigate(["tabs"]);
    });
  }

  ngOnInit() {}
}
