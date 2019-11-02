import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
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
  private me: User;

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

  public getMe(): User {
    return this.me;
  }

  private updateUserDataWithGoogle(user: any) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(
      `users/${user.uid}`
    );

    userRef.get().subscribe(afUser => {
      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      this.me = data;
      if (!afUser.exists) {
        localStorage.setItem("firstlogin", "true");
        return userRef.set(data, { merge: true });
      }
    });
  }

  // siginUp(email: string, password: string) {
  //   return this.afAuth.auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then((user: any) => {
  //       console.log(user);
  //       this.updateUserData(user);
  //       return user;
  //     })
  //     .catch(err => console.log(err));
  // }

  // login(email: string, password: string): Promise<any> {
  //   return this.afAuth.auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((user: any) => {
  //       console.log(user);
  //       this.updateUserData(user);
  //       return user;
  //     })
  //     .catch(err => {
  //       return err;
  //     });
  // }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/login"]);
    });
  }

  getAfUser(): Observable<any> {
    return this.afAuth.user;
  }

  getUser(uid: string): Observable<User> {
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(
      `users/${uid}`
    );
    return userRef.valueChanges();
  }

  getGroups(): Observable<any> {
    const groupRefs: AngularFirestoreCollection<any> = this.afStore.collection(
      `groups`
    );

    return groupRefs.valueChanges();
  }

  public updateUserData(param: any): Subscription {
    console.log(param);
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(
      `users/${param.uid}`
    );

    return userRef.valueChanges().subscribe(baseUserData => {
      const data: User = {
        uid: baseUserData.uid,
        email: baseUserData.email,
        displayName: param.displayName || baseUserData.displayName,
        photoURL: param.photoURL || baseUserData.photoURL,
        group: param.group || baseUserData.group
      };
      return userRef.set(data);
    });
  }
}
