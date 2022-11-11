import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Reply } from '../models/reply';
import { ReplyService } from '../models/reply.service';

@Component({
  selector: 'app-replied-plane',
  templateUrl: './replied-plane.component.html',
  styleUrls: ['./replied-plane.component.css']
})
export class RepliedPlaneComponent implements OnInit {
  reply: Reply = {
    reply_id: -1,
    plane_author: -1,
    reply_author: -1,
    original_content: '',
    original_tag: '',
    content: '',
    is_reported: false,
    level: ''
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private replyService: ReplyService) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.replyService.getReply(+params.get('id')))
      .subscribe(reply => {
        this.reply = reply;
        if (this.reply.reply_id === -1) {
          alert('This reply doesn\'t exist!');
          this.router.navigate(['/my_page']);
        }
      });
  }

  onClickLikeButton() {
    this.replyService.likeReply(this.reply.reply_id).then(response => {
      if (response === 406) {
        alert('You already liked this reply!');
      } else if (response === 403) {
        alert('You cannot like other\'s reply!');
      } else if (response === 200) {
        alert('Liked this reply!');
      } else {
        alert('An error occurred. Please try again!');
      }
    });
  }

  onClickCancelButton() {
    this.router.navigate(['/my_page']);
  }

  onClickReportButton() {
    if (confirm('Do you want to report this reply?')) {
      this.replyService.report(this.reply).then(response => {
        if (response === 200) {
          alert('Successfully reported.');
          this.replyService.deleteReply(this.reply.reply_id);
          this.router.navigate(['/my_page']);
        } else {
          alert('An error occurred. Please try again.');
        }
      });
    }
  }
}

