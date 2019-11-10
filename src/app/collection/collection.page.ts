import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../service/firebase.service";
import { User } from "../model/user";
import { AuthService } from "../service/auth.service";
import { Subject, Subscription } from "rxjs";
import { Status } from "../enum/status.enum";
import { LoadingService } from "../service/loading.service";
import { UserService } from "../service/user.service";
import { NotificationService } from "../service/notification.service";
import { Router } from "@angular/router";
import { Receipt } from "../model/receipt";

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
    public router: Router,
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
            slackID: user.slackID,
            group: user.group
          };
          this.fetchCollection();
        });
    });
  }

  ngOnDestroy(): void {
    this.meSubscribe.unsubscribe();
    this.dbSubscribe.unsubscribe();
  }

  fetchCollection(): void {
    this.dbSubscribe = this.firebase
      .fetchDatabase(this.me.group)
      .subscribe(receipts => {
        receipts.forEach(billings => {
          for (let key in billings) {
            if (billings[key].addressID == this.me.uid) {
              this.billings.push(billings[key]);
            }
          }
        });
      });
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
    this.firebase.getReceipt(this.me.group, receiptID).subscribe(r => {
      this.receiptSubject.next(r.name);
    });
    return this.receiptSubject;
  }

  goDetail(billing: any): void {
    this.router.navigate(["/detail"], {
      state: {
        me: this.me,
        billing: billing
      }
    });
  }

  updateStatus(event: Event, billing: any, status: Status): void {
    event.stopPropagation();
    this.loadingSvc.present();
    this.firebase
      .updateStatus(status, billing.id, this.me.group, billing.receiptID)
      .then(
        () => {
          this.fetchCollection();
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
