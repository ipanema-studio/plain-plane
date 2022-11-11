import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-password',
  templateUrl: './find-password.component.html',
  styleUrls: ['./find-password.component.css']
})
export class FindPasswordComponent implements OnInit {

  username = '';
  email = '';
  captcha_key = '';

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {

  }

  validateUsername(username: string): boolean {
    if (username === '') {
      alert('Username is empty. Please fill in username!');
      return false;
    }

    if (!(/^[A-Za-z0-9]+$/.test(username))) {
      alert('Username can only contain alphanumeric characters. Please try again!');
      return false;
    }

    if (username.length < 2 || username.length > 32) {
      alert('Username should be length 2 ~ 32. Please try again!');
      return false;
    }

    return true;
  }

  validateEmail(email: string): boolean {
    if (email === '') {
      alert('Email is empty. Please fill in username!');
      return false;
    }

    const emailSplitByAtSign = email.split('@');
    if (emailSplitByAtSign.length !== 2) {
      alert('Email form is wrong. Please try again!');
      return false;
    }

    if (emailSplitByAtSign[0].length === 0 || emailSplitByAtSign[1].length === 0) {
      alert('Email form is wrong. Please try again!');
      return false;
    }

    return true;
  }

  validateCaptcha(captcha_key: string): boolean {
    if (captcha_key === '') {
      alert('Please do Captcha to find your password!');
      return false;
    }

    return true;
  }

  validateInput(username: string, email: string, captcha_key: string): boolean {
    if (!this.validateUsername(username)) {
      return false;
    }

    if (!this.validateEmail(email)) {
      return false;
    }

    if (!this.validateCaptcha(captcha_key)) {
      return false;
    }

    return true;
  }

  onClickSubmitButton() {
    if (!this.validateInput(this.username, this.email, this.captcha_key)) {
      return;
    }

    this.userService.findPassword(this.username, this.email, this.captcha_key).then(response => {
      if (!response['success']) {
        switch (response['error-code']) {
          case 1: {
            // Wrong arguments
            alert('An error occurred. Please try again!');
            break;
          }
          case 2: {
            // Captcha fails
            alert('reCaptcha failed. Please try again!');
            break;
          }
          case 3: {
            // Username not exist
            alert('That username doesn\'t exist. Please check the username and try again!');
            break;
          }
          case 4: {
            // Email not verified
            alert('You didn\t set a verified email address. We\'re sorry, but you cannot find a password.');
            break;
          }
          case 5: {
            // Email does not match
            alert('The username and its verified email doesn\'t match. Please try again!');
            break;
          }
        }
      } else {
        alert('We changed your password and sent it to your verified email. Please check your mailbox.');
        this.router.navigate(['/']);
      }
    });
  }
}
