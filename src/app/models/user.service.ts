import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from './user';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  // TODO: Change this handleError
  private static handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }

  getUser(): Promise<User> {
    return this.http.get('/api/user/get/')
      .toPromise()
      .then(response => {
        const responseData = response.json();
        const user_id = responseData['user'];
        const username = responseData['username'];
        const level = responseData['level'];
        const today_write_count = responseData['today_write_count'];
        const today_reply_count = responseData['today_reply_count'];
        const total_likes = responseData['total_likes'];
        const user: User = {
          user_id: user_id,
          username: username,
          level: level,
          today_write_count: today_write_count,
          today_reply_count: today_reply_count,
          total_likes: total_likes};
        return Promise.resolve(user);
      })
      .catch(e => {
        if (e.status === 403) {
          return Promise.resolve(null);
        } else {
          UserService.handleError(e);
        }
      });
  }

  checkUserExists(username: string): Promise<{'available': boolean}> {
    const dataToSend = {
      'username': username
    };

    return this.http.post('/api/user/check/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(UserService.handleError);
  }

  signIn(username: string, password: string, captcha_key: string):
  Promise<{'success': boolean,
           'user_id': number,
           'error-code': number,
           'today_write_count': number,
           'today_reply_count': number}> {
    const dataToSend = {
      'username': username,
      'password': password,
      'g-recaptcha-response': captcha_key
    };

    return this.http.post('/api/user/sign_in/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(UserService.handleError);
  }

  signUp(username: string, email: string, password: string, captcha_key: string):
  Promise<{'success': boolean, 'error-code': number}> {
    const dataToSend = {
      'username': username,
      'email': email,
      'password': password,
      'g-recaptcha-response': captcha_key
    };

    return this.http.post('/api/user/sign_up/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(UserService.handleError);
  }

  findPassword(username: string, email: string, captcha_key: string):
  Promise<{'success': boolean, 'error-code': number}> {
    const dataToSend = {
      'username': username,
      'email': email,
      'g-recaptcha-response': captcha_key
    };

    return this.http.post('/api/user/find_password/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(UserService.handleError);
  }

  signOut(): Promise<number> {
    return this.http.get('/api/user/sign_out')
      .toPromise()
      .then(response => response.status)
      .catch(UserService.handleError);
  }

  changePassword(currentPassword: string, newPassword: string): Promise<number> {
    const dataToSend = {
      'current_password': currentPassword,
      'new_password': newPassword
    };

    return this.http.post('/api/user/new_password/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch (e => {
        return Promise.resolve(e.status);
      });
  }
}
