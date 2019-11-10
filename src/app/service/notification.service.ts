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
        channel: "a_and_g",
        // FIXME:
        text:
          "<@" + sourceSlackID + "> " + fromName + "が支払いを完了しました。"
      },
      options
    );
    seq.subscribe(
      data => {
        console.log(data);
      },
      (httpError: HttpErrorResponse) => {
        console.log(httpError);
      }
    );
    return seq;
  }
}
