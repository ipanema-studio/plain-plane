import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Photo } from './photo';

@Injectable()
export class PhotoService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getRandomPhotos(): Promise<Photo[]> {
    const url = `/api/photo/random`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getColorPhotos(color: number): Promise<Photo[]> {
    const url = `/api/photo/color/${color}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getPhoto(id: number): Promise<Photo> {
    const url = `/api/photo/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // create

  delete(id: number): Promise<void> {
    const url = `/api/photo/color/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  report(photo: Photo): Promise<Photo> {
    const url = `/api/photo/${photo.id}/report/`;
    return this.http.put(url, JSON.stringify(photo), {headers: this.headers})
      .toPromise()
      .then(() => photo)
      .catch(this.handleError);
  }

  // TODO: Change this handleError
  private handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }
}
