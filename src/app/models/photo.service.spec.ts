import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Photo } from './photo';
import { PhotoService } from './photo.service';

const makePhotosData = () => [
  { id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1},
  { id: 1, author: 2, image: 'assets/images/2.jpg', tag: 'work', color: 4},
  { id: 2, author: 1, image: 'assets/images/3.jpg', tag: 'good', color: 5},
] as Photo[];

const photosData = [
  { id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1},
  { id: 1, author: 2, image: 'assets/images/2.jpg', tag: 'work', color: 4},
  { id: 2, author: 1, image: 'assets/images/3.jpg', tag: 'good', color: 5},
] as Photo[];

const colorPhotoData = [{ id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1}];
const photoData = { id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1};

describe('PhotoService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        PhotoService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    })
      .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([PhotoService], (service: PhotoService) => {
      expect(service instanceof PhotoService).toBe(true);
    }));

  it('can instantiate service with "new"',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new PhotoService(http);
      expect(service instanceof PhotoService).toBe(true);
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull();
    }));

  describe('when getRandomPhotos', () => {
    let backend: MockBackend;
    let service: PhotoService;

    let fakePhotos: Photo[];
    let response: Response;

    let anotherWayOfFakePhotoes: Photo[];
    let anotherWayOfResponse: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PhotoService(http);

      fakePhotos = makePhotosData();
      let options = new ResponseOptions({status: 200, body: fakePhotos});
      response = new Response(options);

      anotherWayOfFakePhotoes = photosData;
      anotherWayOfResponse = new Response(new ResponseOptions({status: 200, body: anotherWayOfFakePhotoes}));
    }));

    it('get random photos', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      expect(service.getRandomPhotos()).not.toBeNull();
    })));

    it('delete photo', async(inject([], () => {
      // subscribe the backend to a response.
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.delete(photoData.id).then(response =>
        expect(response).not.toBeTruthy()
      );
    })));

    it('report photo', async(inject([], () => {
      // subscribe the backend to a response.
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.report(photoData).then(photo =>
        expect(photo.id).toBe(photoData.id)
      );
    })));
  });

  describe('when getColorPhotos', () => {
    let backend: MockBackend;
    let service: PhotoService;
    let fakePhotos: Photo[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PhotoService(http);
      fakePhotos = colorPhotoData;
      let options = new ResponseOptions({status: 200, body: fakePhotos});
      response = new Response(options);
    }));

    it('should have expected fake photoes (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getColorPhotos(1)
        .then(response => {
          expect(response).not.toBe(null);
        });
    })));
  });

  describe('when getPhoto', () => {
    let backend: MockBackend;
    let service: PhotoService;
    let fakePhoto: Photo;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PhotoService(http);
      fakePhoto = photoData;
      let options = new ResponseOptions({status: 200, body: fakePhoto});
      response = new Response(options);
    }));

    it('should have expected fake photoes (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getPhoto(fakePhoto.id)
        .then(photo => {
          expect(photo.id).toBe(fakePhoto.id,
            'should have the photo id');
        });
    })));
  });
});
