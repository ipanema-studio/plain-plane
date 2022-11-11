import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../models/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  username = '';
  email = '';
  password = '';
  password_repeat = '';
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

  validatePassword(password: string, password_repeat: string): boolean {
    if (password === '') {
      alert('Password is empty. Please fill in password!');
      return false;
    }

    if (password.length < 8 || password.length > 32) {
      alert('Password should be length 8 ~ 32. Please try again!');
      return false;
    }

    if (password_repeat === '') {
      alert('Password Again field is empty. Please fill in password again!');
      return false;
    }

    if (password !== password_repeat) {
      alert('Password does not match. Please try again!');
      return false;
    }

    return true;
  }

  validateCaptcha(captcha_key: string): boolean {
    if (captcha_key === '') {
      alert('Please do Captcha to sign up!');
      return false;
    }

    return true;
  }

  validateInput(username: string, email: string, password: string, password_repeat: string, captcha_key: string):
  boolean {
    if (!this.validateUsername(username)) {
      return false;
    }

    if (email !== '') {
      if (!this.validateEmail(email)) {
        return false;
      }
    }

    if (!this.validatePassword(password, this.password_repeat)) {
      return false;
    }

    if (!this.validateCaptcha(captcha_key)) {
      return false;
    }

    return true;
  }

  checkUsernameAvailable() {
    if (!this.validateUsername(this.username)) {
      return;
    }

    this.userService.checkUserExists(this.username).then(response => {
      if (response['available']) {
        alert(`You can use username ${this.username}!`);
      } else {
        alert(`Username ${this.username} already exists. Please use another username!`);
      }
    });
  }

  onClickSignUpButton() {
    if (!this.validateInput(this.username, this.email, this.password, this.password_repeat, this.captcha_key)) {
      return;
    }

    if (this.email !== '') {
      alert('We\'ll send you a verification email. It may take a while. Please wait for a second please!');
    }

    this.userService.signUp(this.username, this.email, this.password, this.captcha_key).then(response => {
        if (!response['success']) {
          switch (response['error-code']) {
            case 1: {
              // wrong attribute
              alert('An Error occurred. Please try again!');
              break;
            }
            case 2: {
              // captcha failed
              alert('Captcha failed!');
              break;
            }
            case 3: {
              // username already exists
              alert('Username already exists!');
              break;
            }
          }
        } else {
          let message = 'Sign-up successful!';
          if (this.email !== '') {
            message += '\nWe sent you a verification email. Please check your mailbox.';
          }
          alert(message);
          this.router.navigate(['/']);
        }
      }
    );
  }
}
