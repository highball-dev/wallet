import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../model/user";
import { FirebaseService, Billing } from "../service/firebase.service";
import { Receipt } from "../model/receipt";
import { Observable } from "rxjs";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"]
})
export class DetailPage implements OnInit {
  billing: Billing;
  me: User;
  receipt$: Observable<Receipt>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.billing = this.router.getCurrentNavigation().extras.state.billing;
        this.me = this.router.getCurrentNavigation().extras.state.me;
        console.log(this.billing);
        console.log(this.me);
        this.receipt$ = this.firebase.getReceipt(
          this.me.group,
          this.billing.receiptID
        );

        this.firebase
          .getBillings(this.me.group, this.billing.sourceID)
          .subscribe(d => {
            console.log(d);
          });
      }
    });
  }

  ngOnInit() {}
}
