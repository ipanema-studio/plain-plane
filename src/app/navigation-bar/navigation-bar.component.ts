import { Component } from '@angular/core';
import { UserService } from '../models/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {

  constructor(private userService: UserService,
              private router: Router) { }


  onClickPlanesButton() {
    this.router.navigate(['/planes']);
  }

  onClickWriteButton() {
    this.router.navigate(['/write']);
  }

  onClickGalleryButton() {
    this.router.navigate(['/gallery']);
  }

  onClickMyPageButton() {
    this.router.navigate(['/my_page']);
  }

  onClickSignOutButton() {
    this.userService.signOut().then(response => {
      if (response === 200) {
        sessionStorage.removeItem('signed_in');
        sessionStorage.removeItem('user_id');
        this.router.navigate(['/']);
      } else {
        alert('An error occurred. Please try again!');
      }
    });
  }
}
