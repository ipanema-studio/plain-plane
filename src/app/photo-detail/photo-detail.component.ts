import {Component, EventEmitter, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Photo } from '../models/photo';
import { PhotoService } from '../models/photo.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  photo: Photo = {
    id: -1,
    author: -1,
    image: '',
    tag: '',
    color: -1
  };

  tag = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService,
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.photoService.getPhoto(+params.get('id')))
      .subscribe(photo => {
        this.photo = photo;
        // this.getAuthor();
        this.tag = photo.tag;
      });
  }

  onClickReportButton(selectedPhoto: Photo) {
    if (confirm('Do you want to report this photo?')) {
      this.photoService.report(selectedPhoto);
      alert('Successfully Reported');
    }
  }

  goBack(): void {
    this.router.navigate(['/gallery']);
  }
}
