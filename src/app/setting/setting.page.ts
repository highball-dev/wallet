import { Component, OnInit } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { User } from "../model/user";
import { ModalController, AlertController } from "@ionic/angular";
import { LoadingService } from "../service/loading.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.page.html",
  styleUrls: ["./setting.page.scss"]
})
export class SettingPage implements OnInit {
  groups: any[];
  me: User;
  displayName: string;
  selectedGroup: string;
  constructor(
    public auth: AuthService,
    public router: Router,
    public loadingSvc: LoadingService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {
    this.auth.getGroups().subscribe(groups => {
      this.groups = groups;
    });

    // FIXME
    this.auth.getAfUser().subscribe(afUser => {
      this.auth.getUser(afUser.uid).subscribe(user => {
        this.me = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          group: user.group
        };
        this.displayName = this.me.displayName;
        this.selectedGroup = this.me.group;
        console.log(this.selectedGroup);
      });
    });
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  submit(): void {
    this.loadingSvc.present();
    console.log(this.displayName);
    this.auth.updateUserData({
      uid: this.me.uid,
      group: this.selectedGroup,
      displayName: this.displayName
    });
    this.loadingSvc.dismiss();
  }

  logout() {
    this.auth.logout();
  }

  async openGroupAlert() {
    const alert = await this.alertCtrl.create({
      header: "グループが設定されていません",
      buttons: [
        {
          text: "設定する",
          handler: () => {
            this.router.navigate(["tabs/setting"]);
          }
        }
      ]
    });
    await alert.present();
  }
}
