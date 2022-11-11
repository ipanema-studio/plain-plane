import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { PhotoListComponent } from './photo-list.component';
import { Router } from '@angular/router';
import { Photo } from '../models/photo';
import { PhotoService } from '../models/photo.service';
import {By} from '@angular/platform-browser';

describe('PhotoListComponent', () => {
  let comp: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          PhotoService,
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: PhotoService, useClass: FakePhotoService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoListComponent);
    comp = fixture.componentInstance;
  }));

  it('should have images', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.ngOnInit();
    tick();
    expect(fixture.debugElement.query(By.css('.row-gallery.combo'))).not.toBeNull();
    expect(app.checkPhoto(0)).toBe(true);
    expect(app.checkPhoto(1)).toBe(true);
    expect(app.checkPhoto(2)).toBe(true);
  }));

  it('should navigate on click photo', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    const photo = FakePhotoService.fakePhotos[0];
    app.goToDetail(photo);
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should navigate on create button', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.goCreate();
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should get photos with specific color on click color photo button', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.onClickColorPhotoButton(4)
    tick();
    expect(app.checkPhoto(0)).toBe(true);
    expect(app.checkPhoto(1)).toBe(false);
  }));

});


let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakePhotoService {
  static fakePhotos: Photo[] = [
    { id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1},
    { id: 1, author: 2, image: 'assets/images/2.jpg', tag: 'work', color: 4},
    { id: 2, author: 1, image: 'assets/images/3.jpg', tag: 'good', color: 5},
  ];

  getRandomPhotos(): Promise<Photo[]> {
    return Promise.resolve<Photo[]>(FakePhotoService.fakePhotos);
  }

  getColorPhotos(color: number): Promise<Photo[]> {
    return Promise.resolve(FakePhotoService.fakePhotos.filter(photo => photo.color === color));
  }

  getPhoto(id: number): Promise<Photo> {
    return Promise.resolve(FakePhotoService.fakePhotos[id]);
  }

  delete(id: number): Promise<void> {
    delete FakePhotoService.fakePhotos[id];
    return Promise.resolve();
  }

  report(photo: Photo): Promise<Photo> {
    delete FakePhotoService.fakePhotos[photo.id];
    return Promise.resolve(photo);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

