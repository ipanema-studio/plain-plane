import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Plane } from './plane';
import { PlaneService } from './plane.service';

const planesData = [
  { author_id: 1, plane_id: 0, content: 'Windstorm', tag: 'love', level: 'Plain' },
  { author_id: 1, plane_id: 1, content: 'Bombasto', tag: 'study', level: 'Plain' },
  { author_id: 2, plane_id: 2, content: 'Magneta', tag: 'exam', level: 'Plain' },
  { author_id: 3, plane_id: 3, content: 'Tornado', tag: 'love', level: 'Plain' }
] as Plane[]; // a const planes data.

const dataToSend = { content: 'data', tag: 'aaa', has_location: false };
const dataWithLocation = { content: 'data', tag: 'aaa', has_location: true, latitude: 37.0, longitude: 128.0 };
const location = { latitude: 37.0, longitude: 128.0 };

const planeData = { author_id: 1, plane_id: 0, content: 'Windstorm', tag: 'love', level: 'Plain' } as Plane; // a const plane data.

describe('PlaneService (mockBackend)', () => {

  beforeEach( async(() => { // We wrap it in async, because we want to compile modules and external files (like HTML, CSS) asynchronously.
    TestBed.configureTestingModule({ // TestBed configures modules, as in our AppModule, but for this test only.
      imports: [ HttpModule ],
      providers: [
        PlaneService,
        { provide: XHRBackend, useClass: MockBackend } // We don't have a backend here, so we 'mock' one for this service.
      ]
    })
      .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([PlaneService], (service: PlaneService) => { // one way of 'injecting' PlaneService for us to test.
      expect(service instanceof PlaneService).toBe(true);
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => { // a way of providing a mock backend that produces http responses.
      expect(backend).not.toBeNull('backend should be provided');
    }));

  describe('Get a Plane By Id', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let fakePlane: Plane;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      fakePlane = planeData;
      let options = new ResponseOptions({status: 200, body: fakePlane});
      response = new Response(options);
    }));

    it('should have expected fake plane', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getPlane(fakePlane.plane_id)
        .then(plane => {
          expect(plane.plane_id).toBe(fakePlane.plane_id,
            'should have the same author_id');
          expect(plane.author_id).toBe(fakePlane.author_id,
            'should have the same author_id');
          expect(plane.content).toBe(fakePlane.content,
            'should have the same content');
          expect(plane.tag).toBe(fakePlane.tag,
            'should have the same tags');
        });
    })));
  });

  describe('Get Random Planes & Report or Delete a Plane', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let fakePlanes: Plane [];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      fakePlanes = planesData;
      let options = new ResponseOptions({status: 200, body: fakePlanes});
      response = new Response(options);
    }));

    it('should have expected no. fake plane <= 6', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getRandomPlanes()
        .then(planes => {
          // console.log(planes);
          expect(planes.length).toBe(fakePlanes.length,
            'should have the same no. of planes');
        });
    })));

    it('report photo', async(inject([], () => {
      // subscribe the backend to a response.
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.report(planeData).then(response =>
        expect(response).toBe(200, 'should be 200')
      );
    })));

    it('delete photo', async(inject([], () => {
      // subscribe the backend to a response.
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.deletePlane(planeData.plane_id).then(response =>
        expect(response).toBe(200, 'should be 200')
      );
    })));
  });

  describe('Get Near Planes', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let fakePlanes: Plane [];
    let sendLocation;
    let responsePost: Response;
    let responseGet: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      sendLocation = location;
      fakePlanes = planesData;
      let options = new ResponseOptions({status: 201, body: sendLocation});
      responsePost = new Response(options);
      responseGet = new Response(new ResponseOptions({status: 200, body: fakePlanes}));
    }));

    it('should have expected no. fake plane <= 6', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(responseGet));

      service.getNearPlanes(36.9, 127.96, 5)
        .then(planes => {
          // console.log(planes);
          expect(planes.length).toBe(fakePlanes.length,
            'should have the same no. of planes');
        });
    })));
  });

  describe('Fold a New Plane without location', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let sendPlane;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      sendPlane = dataToSend;
      let options = new ResponseOptions({status: 201, body: sendPlane});
      response = new Response(options);
    }));

    it('write plane without location', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.foldNewPlane(sendPlane.content, sendPlane.tag, -1, -1)
        .then(response => {
          // console.log(planes);
          expect(response).toBe(201,
            'should be 201');
        });
    })));
  });

  describe('Fold a New Plane with location', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let sendPlane;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      sendPlane = dataWithLocation;
      let options = new ResponseOptions({status: 201, body: sendPlane});
      response = new Response(options);
    }));

    it('write plane with location', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.foldNewPlane(sendPlane.content, sendPlane.tag, sendPlane.latitude, sendPlane.longitude)
        .then(response => {
          // console.log(planes);
          expect(response).toBe(201,
            'should be 201');
        });
    })));
  });
});
