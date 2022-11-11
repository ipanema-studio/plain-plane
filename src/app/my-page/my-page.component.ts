import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user.service';
import { ReplyService } from '../models/reply.service';
import { User } from '../models/user';
import { Reply } from '../models/reply';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css']
})
export class MyPageComponent implements OnInit {
  user: User = {
    user_id: -1,
    username: '',
    level: '',
    today_write_count: 0,
    today_reply_count: 0,
    total_likes: 0,
  };
  replies: Reply[] = [];
  pageIndex = 0;

  constructor(private userService: UserService,
              private replyService: ReplyService,
              private router: Router) { }

  ngOnInit() {
    this.getSignedInUser();
  }

  getLevelImage() {
    const levelName = this.user.level.toLowerCase();
    return `assets/images/yogurt_${levelName}.png`;
  }

  getReplyImage(reply: Reply): string {
    const plainName = reply.level.toLowerCase();
    return `assets/images/plane_${plainName}.png`;
  }

  getSignedInUser() {
    this.userService.getUser().then(user => {
      this.user = user;
      this.getReplies();
    });
  }

  getReplies() {
    this.replyService.getReplyByUser(this.user.user_id).then(replies => {
      this.replies = replies;
    });
  }

  checkReply(num: number): boolean {
    return num < this.replies.length;
  }

  onClickReply(reply: Reply) {
    this.router.navigate([`/reply/${reply.reply_id}`]);
  }

  onClickPageDown() {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
    }
  }

  onClickPageUp() {
    const maxPageIndex = Math.ceil(this.replies.length / 6) - 1;
    if (this.pageIndex < maxPageIndex) {
      this.pageIndex += 1;
    }
  }

  onClickChangePasswordButton() {
    this.router.navigate(['/change_password']);
  }
}
