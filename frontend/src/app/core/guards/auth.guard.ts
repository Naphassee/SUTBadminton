import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login-organizer'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const allowed: string[] = route.data['roles'] || [];
    const role = this.auth.getUserRole();
    if (allowed.length && (!role || !allowed.includes(role))) {
      this.router.navigate(['/no-permission']);
      return false;
    }
    return true;
  }
}