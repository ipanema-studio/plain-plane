import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user.service';
import { PlaneService } from '../models/plane.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css'],
  animations: [
    trigger('slideInOut', [
      state('paperIn', style({
        transform: 'translateY(0)'
      })),
      state('paperOut', style({
        transform: 'translateY(1500px)'
      })),
      state('planeIn', style({
        transform: 'translateY(-200px)'
      })),
      state('planeOut', style({
        transform: 'translateY(100%)'
      })),
      state('planeAccel', style({
        transform: 'translateY(-1500px)'
      })),
      transition('paperIn => paperOut', [
        animate('1s ease-out')
      ]),
      transition('planeOut => planeIn', [
        animate('1s ease-in')
      ]),
      transition('planeIn => planeAccel', [
        animate('1s ease-in')
      ])
    ]),
  ]
})
export class WriteComponent implements OnInit {
  content = '';
  tag = '';
  latitude = -1.0;
  longitude = -1.0;
  planeState: string = 'planeOut';
  paperState: string = 'paperIn';

  constructor(private userService: UserService,
              private planeService: PlaneService,
              private router: Router) { }

  ngOnInit() {
    this.userService.getUser().then(user => {
      if (user.today_write_count <= 0) {
        alert('Sorry. You ran out of today\'s write count. Please wait until tomorrow!');
        this.router.navigate(['/my_page']);
      }
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords['latitude'];
        this.longitude = position.coords['longitude'];
      })
    }
  }

  validateInput(content: string, tag: string): boolean {
    if (content === '') {
      alert('Content is empty. Please fill in content!');
      return false;
    }

    if (tag === '') {
      alert('Tag is empty. Please fill in tag!');
      return false;
    }

    return true;
  }

  onClickCancelButton() {
    this.router.navigate(['/planes']);
  }

  /*
  onClickChangeSkyButton() {
    // TODO: Implement
    alert('Sorry. NOT IMPLEMENTED until now!');
  }
  */

  onClickFoldButton() {
    // TODO: implement here
    if (!this.validateInput(this.content, this.tag)) {
      return;
    }

    this.paperState = 'paperOut';
    setTimeout(() => {
      this.planeState = 'planeIn';
    }, 1200);
    setTimeout(() => {
      this.planeState = 'planeAccel';
    }, 2500);
    setTimeout(() => {
      this.planeService.foldNewPlane(this.content, this.tag, this.latitude, this.longitude).then(response => {
        if (response === 201) {
          this.router.navigate(['/planes']);
        } else {
          alert('An error occured. Please try again!');
        }
      });
    }, 3500);

  }
}
