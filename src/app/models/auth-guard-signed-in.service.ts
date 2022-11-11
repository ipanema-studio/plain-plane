import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardSignedInService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    if (sessionStorage.getItem('signed_in') !== 'yes') {
      alert('Please sign in!');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
