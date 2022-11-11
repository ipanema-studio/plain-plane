import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromPromise';

import { Photo } from '../models/photo';
import { PhotoService } from '../models/photo.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  title = 'Photo List';
  photos: Photo[] = [];

  constructor(
    private router: Router,
    private photoService: PhotoService,
  ) { }

  ngOnInit(): void {
    this.getPhotos();
  }

  getPhotos(): void {
    this.photoService.getRandomPhotos().then(photos => {
      this.photos = photos;
    });
  }

  goToDetail(selectedPhoto: Photo): void {
    this.router.navigate(['/gallery', selectedPhoto.id]);
  }

  checkPhoto(num: number): boolean {
    return num < this.photos.length;
  }

  onClickReportButton(selectedPhoto: Photo) {
    if (confirm('Do you want to report this photo?')) {
      this.photoService.report(selectedPhoto);
      alert('Successfully Reported');
    }
  }

  onClickColorPhotoButton(color: number) {
    this.photoService.getColorPhotos(color).then(photos => {
      this.photos = photos;
    });
  }

  goCreate(): void {
    this.router.navigate(['/gallery/post']);
  }


}
