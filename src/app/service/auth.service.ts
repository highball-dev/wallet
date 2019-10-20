import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

import { Router } from "@angular/router";
import { User } from "../model/user";
import { auth } from "firebase";

const TOKEN_KEY = "auth-token";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: Observable<User | null> = this.afAuth.user;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore
  ) {}

  async signinWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserDataWithGoogle(credential.user);
  }

  private updateUserDataWithGoogle(user: any) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });
  }

  siginUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user: any) => {
        console.log(user);
        this.updateUserData(user);
        return user;
      })
      .catch(err => console.log(err));
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((user: any) => {
        console.log(user);
        this.updateUserData(user);
        return user;
      })
      .catch(err => {
        return err;
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/login"]);
    });
  }

  private updateUserData(param: any) {
    const user: User = param.user;
    const docUser: AngularFirestoreDocument<User> = this.afStore.doc(
      `users/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      profile: user.profile || ""
    };
    return docUser.set(data);
  }
}
