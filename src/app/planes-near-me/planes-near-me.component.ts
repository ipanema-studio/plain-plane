import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user.service';
import { PlaneService } from '../models/plane.service';
import { Router } from '@angular/router';
import {Plane} from "../models/plane";

@Component({
  selector: 'app-planes-near-me',
  templateUrl: './planes-near-me.component.html',
  styleUrls: ['./planes-near-me.component.css']
})
export class PlanesNearMeComponent implements OnInit {

  planes: Plane[] = [];
  latitude = -1.0;
  longitude = -1.0;
  radius = 5;

  constructor(private userService: UserService,
              private planeService: PlaneService,
              private router: Router) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords['latitude'];
        this.longitude = position.coords['longitude'];
        this.getNearPlanes(this.latitude, this.longitude, 5);
      })
    }
  }

  onClickEverywhereButton() {
    this.router.navigate(['/planes']);
  }

  checkPlane(num: number): boolean {
    return num < this.planes.length;
  }

  getNearPlanes(lat: number, lon: number, radius: number) {
    this.planeService.getNearPlanes(lat, lon, radius).then(planes => {
      this.planes = planes;
    });
    this.radius = radius;
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
