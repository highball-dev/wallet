import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { User } from "../model/user";
import { FirebaseService } from "../service/firebase.service";
import { AuthService } from "../service/auth.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-dutch",
  templateUrl: "./dutch.page.html",
  styleUrls: ["./dutch.page.scss"]
})
export class DutchPage implements OnInit {
  @Input() receiptID: string;
  @Input() sourceID: string;
  @Input() group: string;
  @Input() title: string;
  @Input() description: string;

  price: number;
  dutchMembers: User[];
  billingAmount: number = 0;
  imgUrlSubject: Subject<string>;

  constructor(
    public auth: AuthService,
    public modalCtrl: ModalController,
    public firebase: FirebaseService
  ) {}

  ngOnInit() {
    this.auth.getGroupUser().subscribe((users: any[]) => {
      this.dutchMembers = users.filter(u => u.uid != this.sourceID);
      console.log(this.dutchMembers);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  calcBillingAmount(): number {
    if (this.dutchMembers && this.dutchMembers.length) {
      if (!this.price) return 0;
      this.billingAmount = Math.ceil(this.price / this.dutchMembers.length);
      return this.billingAmount;
    }
    return 0;
  }

  getImgUrl(sourceID: string): Subject<string> {
    this.auth.getUser(sourceID).subscribe(u => {
      this.imgUrlSubject.next(u.photoURL);
    });
    return this.imgUrlSubject;
  }

  sendBilling(): void {
    this.dutchMembers.forEach((member: User) => {
      this.firebase
        .createBilling(
          this.receiptID,
          member.group,
          member.uid,
          this.sourceID,
          this.billingAmount
        )
        .then(() => {
          this.dismiss();
        });
    });
  }
}
