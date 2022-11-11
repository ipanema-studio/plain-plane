import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Plane } from '../models/plane';
import { UserService } from '../models/user.service';
import { PlaneService } from '../models/plane.service';
import { ReplyService } from '../models/reply.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  plane: Plane = {
    author_id: -1,
    plane_id: -1,
    content: '',
    tag: '',
    level: ''
  };
  replyMessage = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private planeService: PlaneService,
              private userService: UserService,
              private replyService: ReplyService) {
  }

  ngOnInit() {
    this.userService.getUser().then(user => {
      if (user.today_reply_count <= 0) {
        alert('Sorry. You ran out of today\'s reply count. Please wait until tomorrow!');
        this.router.navigate(['/my_page']);
      } else {
        if (confirm(`Do you really want to see this plane?`)) {
          this.route.paramMap
            .switchMap((params: ParamMap) => this.planeService.getPlane(+params.get('id')))
            .subscribe(plane => {
              this.plane = plane;
              if (this.plane.plane_id === -1) {
                alert('This plane doesn\'t exist!');
                this.router.navigate(['/planes']);
              }
            });
        } else {
          // this.router.navigate(['/planes']);
          this.location.back();
        }
      }
    });
  }

  onClickReportButton() {
    if (confirm('Do you want to report this plane?')) {
      this.planeService.report(this.plane).then(response => {
        if (response === 200) {
          alert('Successfully Reported.');
          this.planeService.deletePlane(this.plane.plane_id);
          this.router.navigate(['/planes']);
        } else {
          alert('An error occured. Please try again!');
        }
      });
    }
  }

  onClickCancelButton() {
    // this.router.navigate(['/planes']);
    this.location.back();
  }

  onClickRefoldButton() {
    this.replyService.foldNewReply(this.plane, this.replyMessage).then(response => {
      if (response === 201) {
        // this.router.navigate(['/planes']);
        this.location.back();
      } else {
        alert('An error occured. Please try again!');
      }
    }).catch(e => {
      alert('An error occured. Please try again!');
    });

    this.planeService.deletePlane(this.plane.plane_id);
  }
}
