import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FakeStoreService } from './fake-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private fakeStoreService: FakeStoreService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.fakeStoreService.isLoggedIn();

    if (isLoggedIn && state.url === '/login') {
      this.router.navigate(['/']);
      return false;
    }

    if (!isLoggedIn && state.url !== '/login' && state.url !== '/signup') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
