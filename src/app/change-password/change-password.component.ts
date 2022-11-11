import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../models/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  current_password = '';
  new_password = '';
  new_password_repeat = '';

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit() {
  }

  validateCurrentPassword(password: string): boolean {
    if (password === '') {
      alert('Current Password is empty. Please fill in password!');
      return false;
    }

    if (password.length < 8 || password.length > 32) {
      alert('Current Password should be length 8 ~ 32. Please try again!');
      return false;
    }

    return true;
  }

  validateNewPassword(password: string, password_repeat: string): boolean {
    if (password === '') {
      alert('New Password is empty. Please fill in password!');
      return false;
    }

    if (password.length < 8 || password.length > 32) {
      alert('New Password should be length 8 ~ 32. Please try again!');
      return false;
    }

    if (password_repeat === '') {
      alert('New Password Again field is empty. Please fill in password again!');
      return false;
    }

    if (password !== password_repeat) {
      alert('New Password does not match. Please try again!');
      return false;
    }

    return true;
  }

  onClickSubmitButton() {
    if (!this.validateCurrentPassword(this.current_password)) {
      return;
    }

    if (!this.validateNewPassword(this.new_password, this.new_password_repeat)) {
      return;
    }

    this.userService.changePassword(this.current_password, this.new_password).then(response => {
      switch (response) {
        case 200: {
          alert('Password Successfully Changed!');
          this.router.navigate(['/my_page']);
          break;
        }
        case 403: {
          alert('Current password is wrong. Please try again!');
          break;
        }
        default: {
          alert('An error occurred. Please try again!');
          break;
        }
      }
    });
  }
}

