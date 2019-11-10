import { Component, OnInit } from "@angular/core";
import { FirebaseService, Receipt } from "../service/firebase.service";
import { User } from "../model/user";
import { AuthService } from "../service/auth.service";
import { Subject, Subscription } from "rxjs";
import { Status } from "../enum/status.enum";
import { LoadingService } from "../service/loading.service";
import { UserService } from "../service/user.service";
import { NotificationService } from "../service/notification.service";

@Component({
  selector: "app-collection",
  templateUrl: "./collection.page.html",
  styleUrls: ["./collection.page.scss"]
})
export class CollectionPage implements OnInit {
  public status: typeof Status = Status;
  me: User;
  billings: any[];
  dbSubscribe: Subscription;
  meSubscribe: Subscription;

  nameSubject: Subject<string> = new Subject();
  imgUrlSubject: Subject<string> = new Subject();
  receiptSubject: Subject<any> = new Subject();

  constructor(
    public firebase: FirebaseService,
    public auth: AuthService,
    public loadingSvc: LoadingService,
    public notificationSvc: NotificationService,
    public userSvc: UserService
  ) {}

  ngOnInit() {
    this.billings = [];
    // FIXME:
    this.me = this.auth.getMe();
    this.meSubscribe = this.auth.getAfUser().subscribe(afUser => {
      const userSubscribe: Subscription = this.userSvc
        .getUser(afUser.uid)
        .subscribe(user => {
          this.me = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            group: user.group
          };
          this.dbSubscribe = this.firebase
            .fetchDatabase(this.me)
            .subscribe(d => {
              this.billings = d;
              console.log(this.billings);
            });
          // userSubscribe.unsubscribe();
        });
    });
  }

  ngOnDestroy(): void {
    this.meSubscribe.unsubscribe();
    this.dbSubscribe.unsubscribe();
  }

  getSourceName(sourceID: string): Subject<string> {
    this.userSvc.getUser(sourceID).subscribe(u => {
      this.nameSubject.next(u.displayName);
    });
    return this.nameSubject;
  }

  getImgUrl(sourceID: string): Subject<string> {
    this.userSvc.getUser(sourceID).subscribe(u => {
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

  updateStatus(billing: any, status: Status): void {
    this.loadingSvc.present();
    this.firebase
      .updateStatus(status, billing.id, this.me.group, billing.addressID)
      .then(
        () => {
          this.loadingSvc.dismiss();
          this.notificationSvc
            .doneBillingToSlack(billing.sourceSlackID, this.me.displayName)
            .subscribe(
              d => {
                console.log("post");
              },
              err => {
                console.log(err);
              }
            );
        },
        err => {
          console.log(err);
          this.loadingSvc.dismiss();
        }
      );
  }
}
