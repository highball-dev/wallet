import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router
} from "@angular/router";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "../service/auth.service";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user.pipe(
      take(1),
      map(user => !!user), // userが取得できた場合はtrueを返す
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(["/login"]);
        }
      })
    );
  }
}
