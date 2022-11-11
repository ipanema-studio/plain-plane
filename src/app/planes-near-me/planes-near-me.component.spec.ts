import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { PlanesNearMeComponent } from './planes-near-me.component';
import { Router } from '@angular/router';
import { Plane } from '../models/plane';
import { User } from '../models/user';
import { PlaneService } from '../models/plane.service';
import { UserService } from '../models/user.service';
import {By} from '@angular/platform-browser';

describe('PlanesNearMeComponent', () => {
  let comp: PlanesNearMeComponent;
  let fixture: ComponentFixture<PlanesNearMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          PlaneService,
          UserService,
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: PlaneService, useClass: FakePlaneService},
          {provide: UserService, useClass: FakeUserService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(PlanesNearMeComponent);
    comp = fixture.componentInstance;
  }));

  it('should have near planes', fakeAsync(() => {
    // TODO: activate navigator.geolocation
    const app = fixture.debugElement.componentInstance;
    spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
      return {coords: {latitude: 37.0, longitude: 128.0}};
    });
    console.log(window.navigator.geolocation);
    app.ngOnInit();
    tick();
    expect(fixture.debugElement.query(By.css('.planes-near-me'))).not.toBeNull();
    expect(app.checkPlane(0)).toBe(true);
    expect(app.checkPlane(1)).toBe(true);
    expect(app.checkPlane(2)).toBe(true);
  }));

  it('should navigate on clicked plane', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    const plane = FakePlaneService.fakePlanes[0];
    app.onClickPlane(plane);
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should navigate on planes', fakeAsync(()=>{
    const app = fixture.debugElement.componentInstance;
    app.onClickEverywhereButton();
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));
});


let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakePlaneService {
  static fakePlanes: Plane[] = [
    { author_id: 1, plane_id: 0, content: 'aaa', tag: 'study', level: 'Plain' },
    { author_id: 2, plane_id: 1, content: 'bbb', tag: 'work', level: 'Plain' },
    { author_id: 1, plane_id: 2, content: 'ccc', tag: 'good', level: 'Plain' },
  ];

  getNearPlanes(lat: number, lon: number, radius: number): Promise<Plane[]> {
    return Promise.resolve<Plane[]>(FakePlaneService.fakePlanes);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

class FakeUserService {
  static fakeUsers: User[] = [
    { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 3, total_likes: 1 },
    { user_id: 2, username: 'bb', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
  ];

  getUser(): Promise<User> {
    return Promise.resolve(FakeUserService.fakeUsers[0]);
  }
}

