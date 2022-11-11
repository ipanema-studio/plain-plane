import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user.service';
import { Router } from '@angular/router';
import { Plane } from '../models/plane';
import { PlaneService } from '../models/plane.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  planes: Plane[] = [];
  latitude = -1.0;
  longitude = -1.0;

  constructor(private userService: UserService,
              private planeService: PlaneService,
              private router: Router) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords['latitude'];
        this.longitude = position.coords['longitude'];
      });
    }
    this.getRandomPlanes();
  }

  onClickNearMeButton() {
    if (this.latitude < 0 && this.longitude < 0) {
      alert('Sorry. Please turn on Location Service');
    } else {
      this.router.navigate(['/planes_near_me']);
    }
  }

  getRandomPlanes() {
    this.planeService.getRandomPlanes().then(planes => {
      this.planes = planes;
    });
  }

  checkPlane(num: number): boolean {
    return num < this.planes.length;
  }

  getImage(plane: Plane): string {
    const plainName = plane.level.toLowerCase();
    return `assets/images/plane_${plainName}.png`;
  }

  onClickPlane(selectedPlane: Plane) {
    this.userService.getUser().then(user => {
      if (user.today_reply_count <= 0) {
        alert('Sorry. You ran out of today\'s reply count. Please wait until tomorrow!');
      } else {
        this.router.navigate([`/plane/${selectedPlane.plane_id}`]);
      }
    });
  }
}
