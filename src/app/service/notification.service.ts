import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpErrorResponse,
  HttpClient
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  constructor(public http: HttpClient) {}

  doneBillingToSlack(sourceSlackID: string, fromName: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };
    let seq = this.http.post(
      "https://hooks.slack.com/services/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",
      {
        // FIXME:
        text:
          "<@" + sourceSlackID + "> " + fromName + "が支払いを完了しました。"
      },
      options
    );
    return seq;
  }
}
