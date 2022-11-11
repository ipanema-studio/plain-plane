import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../models/user.service';

@Component({
  selector: 'app-photo-post',
  templateUrl: './photo-post.component.html',
  styleUrls: ['./photo-post.component.css']
})
export class PhotoPostComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  clicked: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUser().then(user => {
      if (user.today_write_count <= 0) {
        alert('Sorry. You ran out of today\'s write count. Please wait until tomorrow!');
        this.router.navigate(['/gallery']);
      }
    });
  }

  url: string;
  tag: string;
  
  readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event:any) => {
        this.url = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private upload() {
    if (!this.clicked) {
      this.upload_observable().subscribe(
        response => {
          if (response == 201) {
            this.router.navigate(['/gallery']);
          }
          else {
            alert('Our detective plane says that it is not sky!');
            this.clicked = false;
          }
        });
    }
  }

  private upload_observable(): Observable<number> {
    return new Observable(observer => {
      if (this.tag === '' || this.tag === undefined) {
        alert('Tag is empty. Please fill in tag!');
        return;
      }

      const fileBrowser = this.fileInput.nativeElement;

      if (fileBrowser.files && fileBrowser.files[0]) {
        let fileSize = fileBrowser.files[0].size;
        let splittedFileName = fileBrowser.files[0].name.split(".")
        let fileType = splittedFileName[splittedFileName.length - 1]

        if (fileSize >= 2097152) {
          alert('Image size exceeds 2MB');
          console.log("size limit");
          return;
        }

        this.clicked = true;
        const formData = new FormData();
        formData.append('author_id', sessionStorage.getItem('user_id'));
        formData.append('image', fileBrowser.files[0]);
        formData.append('tag', this.tag);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '//127.0.0.1:8000/api/photo/upload/', true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            observer.next(xhr.status);
            observer.complete();
          }
        };
        xhr.send(formData);

        sessionStorage.setItem('today_write_count', String(Number(sessionStorage.getItem('today_write_count')) - 1));
      } else {
        alert('The image field is empty. Please upload an image!');
        return;
      }
    });
  }
}
