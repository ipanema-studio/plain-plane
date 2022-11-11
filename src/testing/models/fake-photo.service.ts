import {current} from "codelyzer/util/syntaxKind";

export { Photo }        from '../../app/models/photo';
export { PhotoService } from '../../app/models/photo.service';

import { Photo }        from '../../app/models/photo';
import { PhotoService } from '../../app/models/photo.service';

export const PHOTOS: Photo[] = [
  { id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1},
  { id: 1, author: 2, image: 'assets/images/2.jpg', tag: 'work', color: 4},
  { id: 2, author: 1, image: 'assets/images/3.jpg', tag: 'good', color: 5},
];

export class FakePhotoService {
  photos = PHOTOS;

  getRandomPhotos(): Promise<Photo[]> {
    return Promise.resolve<Photo[]>(this.photos);
  }

  getColorPhotos(color: number): Promise<Photo[]> {
    return Promise.resolve(this.photos.filter(photo => photo.color === color));
  }

  getPhoto(id: number): Promise<Photo> {
    return Promise.resolve(this.photos[id]);
  }

  delete(id: number): Promise<void> {
    delete this.photos[id];
    return Promise.resolve();
  }

  report(photo: Photo): Promise<Photo> {
    delete this.photos[photo.id];
    return Promise.resolve(photo);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

