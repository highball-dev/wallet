import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { User } from "../model/user";
import { FirebaseService } from "../service/firebase.service";

@Component({
  selector: "app-dutch",
  templateUrl: "./dutch.page.html",
  styleUrls: ["./dutch.page.scss"]
})
export class DutchPage implements OnInit {
  @Input() receiptID: string;
  @Input() sourceID: string;
  @Input() title: string;
  @Input() description: string;

  price: number;
  dutchMembers: User[];
  billingAmount: number = 0;

  constructor(
    public modalCtrl: ModalController,
    public firebase: FirebaseService
  ) {
    this.dutchMembers = [
      { uid: "1", email: "hoge", displayName: "aaa" },
      { uid: "2", email: "hoge", displayName: "bbb" },
      { uid: "3", email: "hoge", displayName: "ccc" }
    ];
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  calcBillingAmount(): number {
    if (this.dutchMembers && this.dutchMembers.length) {
      if (!this.price) return 0;
      return (this.billingAmount = Math.ceil(
        this.price / this.dutchMembers.length - 1
      ));
    }
    return 0;
  }

  sendBilling(): void {
    this.dutchMembers.forEach((member: User) => {
      this.firebase.createBilling(
        this.receiptID,
        member.uid,
        this.sourceID,
        this.billingAmount
      );
    });
  }
}
