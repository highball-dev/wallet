import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../service/firebase.service";
import { AuthService } from "../service/auth.service";
import { User } from "../model/user";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-tutorial",
  templateUrl: "./tutorial.page.html",
  styleUrls: ["./tutorial.page.scss"]
})
export class TutorialPage implements OnInit {
  groups: any[];
  me: User;
  displayName: string;
  selectedGroup: string;

  constructor(public auth: AuthService, public modalCtrl: ModalController) {
    this.auth.getGroups().subscribe(groups => {
      this.groups = groups;
    });

    // FIXME
    this.auth.getAfUser().subscribe(user => {
      this.me = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      this.displayName = this.me.displayName;
    });
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  submit(): void {
    this.auth.updateUserData({
      uid: this.me.uid,
      group: this.selectedGroup,
      displayName: this.displayName
    });

    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
}
