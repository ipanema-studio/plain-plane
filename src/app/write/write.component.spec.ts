import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { WriteComponent } from './write.component';
import { Router } from '@angular/router';
import { UserService } from '../models/user.service';
import { PlaneService } from '../models/plane.service';
import {Plane} from "../models/plane";
import {User} from "../models/user";

describe('WriteComponent', () => {
  let comp: WriteComponent;
  let fixture: ComponentFixture<WriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          UserService,
          PlaneService,
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: UserService, useClass: FakeUserService},
          {provide: PlaneService, useClass: FakePlaneService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(WriteComponent);
    comp = fixture.componentInstance;
  }));

  it('should not get location', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.ngOnInit();
    tick();
    expect(app.latitude).toBe(-1.0);
    expect(app.longitude).toBe(-1.0);
  }));

  it('should check content is null', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    spyOn(window, 'alert');
    app.validateInput(app.content, app.tag);
    tick();
    expect(window.alert).toHaveBeenCalledWith('Content is empty. Please fill in content!');
  }));

  it('should check tag is null', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.content = 'aa';
    spyOn(window, 'alert');
    app.validateInput(app.content, app.tag);
    tick();
    expect(window.alert).toHaveBeenCalledWith('Tag is empty. Please fill in tag!');
  }));

  it('should validate content and tag', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.content = 'aa';
    app.tag = 'aa';
    expect(app.validateInput(app.content, app.tag)).toBeTruthy();
    tick();
  }));

  it('should navigate to planes page', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.onClickCancelButton();
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should fold a new plane', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.content = 'aa';
    app.tag = 'aa';
    app.onClickFoldButton();
    tick();
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

  foldNewPlane(content: string, tag: string, lat: number, lon: number): Promise<number> {
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
