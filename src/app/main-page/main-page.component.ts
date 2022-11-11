import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../models/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  username = '';
  password = '';
  captcha_key = '';
  @ViewChild('captchaRef') captchaRef;

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  validateInput(username: string, password: string): boolean {
    if (username === '') {
      alert('Username is empty. Please fill in username!');
      return false;
    }

    if (password === '') {
      alert('Password is empty. Please fill in password!');
      return false;
    }

    return true;
  }

  onClickSignUpButton() {
    this.router.navigate(['/sign_up']);
  }

  onClickFindPasswordButton() {
    this.router.navigate(['/find_password']);
  }

  onClickSignInButton() {
    if (!this.validateInput(this.username, this.password)) {
      return;
    }

    this.captchaRef.execute();
  }

  onClickLookAroundButton() {
    this.router.navigate(['/gallery']);
  }

  doSignIn() {
    this.userService.signIn(this.username, this.password, this.captcha_key).then(response => {
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
              alert('Your username or password is wrong. Please try again!');
              break;
            }
          }
          this.captchaRef.reset();
        } else {
          sessionStorage.setItem('signed_in', 'yes');
          sessionStorage.setItem('user_id', String(response.user_id));
          sessionStorage.setItem('today_write_count', String(response.today_write_count));
          sessionStorage.setItem('today_reply_count', String(response.today_reply_count));

          this.router.navigate(['/planes']);
        }
      }
    );
  }
}
