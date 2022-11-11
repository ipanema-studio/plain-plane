import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../testing';

import { PhotoDetailComponent } from './photo-detail.component';
import { PhotoService } from '../models/photo.service';
import { Photo } from "../models/photo";
import {AppModule} from "../app.module";
import {FakePhotoService, PHOTOS} from "../../testing/models/fake-photo.service";

import 'rxjs/add/operator/switchMap';

describe('PhotoDetailComponent', () => {
  let activatedRoute: ActivatedRouteStub;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let comp: PhotoDetailComponent;
  let expectedPhoto: Photo;

  let photoServiceSpy: any;
  let router: any;


  beforeEach((done: any) => {
    expectedPhoto = {id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1};

    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testParamMap = {id: expectedPhoto.id};

    router = jasmine.createSpyObj('router', ['navigate']);

    photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getPhoto', 'report']);
    photoServiceSpy.getPhoto.and.returnValue(Promise.resolve(expectedPhoto));
    photoServiceSpy.report.and.returnValue(Promise.resolve(expectedPhoto));

    comp = new PhotoDetailComponent(router, <any> activatedRoute, photoServiceSpy);
    comp.ngOnInit();

    // OnInit calls HDS.getPhoto; wait for it to get the fake photo
    photoServiceSpy.getPhoto.calls.first().returnValue.then(done);
  });
  it('should be created', () => {
    expect(comp).toBeTruthy();
  });

  it('should report the photo when report button is clicked', fakeAsync(() => {
    comp.onClickReportButton(PHOTOS[0]);
    spyOn(window, 'confirm').and.callFake(function () {
      return true;
    });
    tick()
    expect(photoServiceSpy.report.calls.any()).toBe(true, 'PhotoService.report called');
  }));

  it('should go back when goBack is called', fakeAsync(() => {
    comp.goBack();
    expect(router.navigate.calls.any()).toBe(true, 'navigate called');
  }));
});
