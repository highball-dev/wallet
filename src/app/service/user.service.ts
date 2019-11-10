import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../model/user";
import {
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private afStore: AngularFirestore) {}

  getUser(uid: string): Observable<User> {
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(
      `users/${uid}`
    );
    return userRef.valueChanges();
  }
}
