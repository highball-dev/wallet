import { Component, OnInit } from "@angular/core";
import { FirebaseService, Receipt } from "../service/firebase.service";
import { User } from "../model/user";
import { AuthService } from "../service/auth.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-collection",
  templateUrl: "./collection.page.html",
  styleUrls: ["./collection.page.scss"]
})
export class CollectionPage implements OnInit {
  me: User;
  billings: any[];
  nameSubject: Subject<string> = new Subject();
  imgUrlSubject: Subject<string> = new Subject();
  receiptSubject: Subject<any> = new Subject();

  constructor(public firebase: FirebaseService, public auth: AuthService) {}

  ngOnInit() {
    this.billings = [];
    // FIXME:
    this.me = this.auth.getMe();
    this.auth.getAfUser().subscribe(afUser => {
      this.auth.getUser(afUser.uid).subscribe(user => {
        this.me = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          group: user.group
        };
        this.firebase.fetchDatabase(this.me).subscribe(d => {
          this.billings = d;
          console.log(this.billings);
        });
      });
    });
  }

  getSourceName(sourceID: string): Subject<string> {
    this.auth.getUser(sourceID).subscribe(u => {
      this.nameSubject.next(u.displayName);
    });
    return this.nameSubject;
  }

  getImgUrl(sourceID: string): Subject<string> {
    this.auth.getUser(sourceID).subscribe(u => {
      this.imgUrlSubject.next(u.photoURL);
    });
    return this.imgUrlSubject;
  }

  getReceiptName(receiptID: string): Subject<Receipt> {
    this.firebase.getReceipt(this.me, receiptID).subscribe(r => {
      this.receiptSubject.next(r.name);
    });
    return this.receiptSubject;
  }
}
