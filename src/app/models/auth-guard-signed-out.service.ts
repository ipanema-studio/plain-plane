import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardSignedOutService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    if (sessionStorage.getItem('signed_in') === 'yes') {
      this.router.navigate(['/planes']);
      return false;
    }
    return true;
  }
}
