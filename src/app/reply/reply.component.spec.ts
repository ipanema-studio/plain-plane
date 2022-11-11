import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { ReplyComponent } from './reply.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Plane } from '../models/plane';
import { User } from '../models/user';
import { PlaneService } from '../models/plane.service';
import { UserService } from '../models/user.service';
import { ReplyService } from '../models/reply.service';
import {By} from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

describe('ReplyComponent', () => {
  let comp: ReplyComponent;
  let fixture: ComponentFixture<ReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          PlaneService,
          UserService,
          ReplyService,
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: Location, useValue: location},
          {provide: ActivatedRoute, useValue: {params: Observable.of({id: 0})}},
          {provide: PlaneService, useClass: FakePlaneService},
          {provide: UserService, useClass: FakeUserService},
          {provide: ReplyService, useClass: FakeReplyService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyComponent);
    comp = fixture.componentInstance;
  }));

  it('should have the plane', fakeAsync(() => {
    // TODO: switchMap
    const app = fixture.debugElement.componentInstance;
    spyOn(window, 'confirm').and.callFake(function () {
      return true;
    });
    app.ngOnInit();
    tick();
    expect(window.confirm).toHaveBeenCalled();
    expect(fixture.debugElement.query(By.css('.paragraph-reply-content'))).not.toBeNull();
    expect(app.plane.plane_id).toBe(0);
  }));

  it('should go back to previous page', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    spyOn(window, 'confirm').and.callFake(function () {
      return false;
    });
    app.ngOnInit();
    tick();
    expect(location.back).toHaveBeenCalled();
  }));

  it('should report the plane', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    spyOn(window, 'confirm').and.callFake(function () {
      return true;
    });
    spyOn(window, 'alert')
    app.onClickReportButton();
    tick();
    expect(window.confirm).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Successfully Reported.");
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should cancel', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.onClickCancelButton();
    tick();
    expect(location.back).toHaveBeenCalled();
  }));

  it('should refold the reply', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.onClickRefoldButton();
    tick();
    expect(location.back).toHaveBeenCalled();
  }));
});


let router = {
  navigate: jasmine.createSpy('navigate')
};

let location = {
  back: jasmine.createSpy('back')
};

class FakePlaneService {
  static fakePlanes: Plane[] = [
    { author_id: 1, plane_id: 0, content: 'aaa', tag: 'study', level: 'Plain' },
    { author_id: 2, plane_id: 1, content: 'bbb', tag: 'work', level: 'Plain' },
    { author_id: 1, plane_id: 2, content: 'ccc', tag: 'good', level: 'Plain' },
  ];

  getPlane(planeId: number) {
    return FakePlaneService.fakePlanes[0];
  }

  report(plane: Plane): Promise<number> {
    return Promise.resolve(200);
  }

  deletePlane(planeId: number) {}

  foldNewPlane(plane: Plane, content: string): Promise<number> {
    return Promise.resolve(201);
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

class FakeReplyService {
  foldNewReply(plane: Plane, content: string): Promise<number> {
    return Promise.resolve(201);
  }
}
