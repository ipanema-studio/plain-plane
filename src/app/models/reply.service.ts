import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Plane } from './plane';
import { Reply } from './reply';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class ReplyService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  // TODO: Change this handleError
  private static handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }

  getReply(replyId: number): Promise<Reply> {
    return this.http.get(`/api/reply/${replyId}/`)
      .toPromise()
      .then(response => response.json() as Reply)
      .catch(e => {
        return Promise.resolve({
          reply_id: -1,
          plane_author: -1,
          reply_author: -1,
          original_content: '',
          original_tag: '',
          content: '',
          level: '',
          is_reported: false
        });
      });
  }

  getReplyByUser(user_id: number): Promise<Reply[]> {
    return this.http.get(`/api/reply/user/${user_id}/`)
      .toPromise()
      .then(response => response.json() as Reply[])
      .catch(ReplyService.handleError);
  }

  report(reply: Reply): Promise<number> {
    const dataToSend = {
      'reply_id': reply.reply_id
    };

    return this.http.put('/api/reply/report/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(ReplyService.handleError);
  }

  foldNewReply(plane: Plane, content: string): Promise<number> {
    const dataToSend = {
      'plane_author': plane.author_id,
      'original_content': plane.content,
      'original_tag': plane.tag,
      'content': content
    };

    sessionStorage.setItem('today_reply_count', String(Number(sessionStorage.getItem('today_reply_count')) - 1));

    return this.http.post('/api/reply/new/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(ReplyService.handleError);
  }

  likeReply(replyId: number): Promise<number> {
    const dataToSend = {
      'reply_id': replyId
    };

    return this.http.put('/api/reply/like/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(e => {
        return Promise.resolve(e.status);
      });
  }

  deleteReply(replyId: number): Promise<number> {
    const dataToSend = {
      'reply_id': replyId
    };

    return this.http.put('/api/reply/delete/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(e => {
        return Promise.resolve(e.status);
      });
  }
}
