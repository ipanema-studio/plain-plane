import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardReplyLeftService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    if (Number(sessionStorage.getItem('today_reply_count')) <= 0) {
      alert('You ran out of today\'s reply count. Please wait until tomorrow!');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
