import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { RepliedPlaneComponent } from './replied-plane.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Reply } from '../models/reply';
import { ReplyService } from '../models/reply.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

describe('RepliedPlaneComponent', () => {
  let comp: RepliedPlaneComponent;
  let fixture: ComponentFixture<RepliedPlaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          ReplyService,
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: ActivatedRoute, useValue: {params: Observable.of({id: 0})}},
          {provide: ReplyService, useClass: FakeReplyService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(RepliedPlaneComponent);
    comp = fixture.componentInstance;
  }));

  it('should have the reply', fakeAsync(() => {
    // TODO: switchMap
    const app = fixture.debugElement.componentInstance;
    app.ngOnInit();
    tick();
    expect(app.reply.reply_id).toBe(1);
  }));

  it('should alert the like', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    spyOn(window, 'alert');
    app.onClickLikeButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Liked this reply!');
  }));

  it('should go back to my page', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    app.onClickCancelButton();
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should report the reply', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    spyOn(window, 'alert');
    app.onClickReportButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Successfully reported.');
    expect(router.navigate).toHaveBeenCalled();
  }));
});


let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakeReplyService {

  static fakeReplies: Reply[] = [
    { reply_id: 1, plane_author: 1, reply_author: 2, content: 'reply1', original_content: 'aaa', original_tag: 'aaa', is_reported: false, level: 'Plain'},
    { reply_id: 2, plane_author: 1, reply_author: 3, content: 'reply2', original_content: 'bbb', original_tag: 'bbb', is_reported: false, level: 'Plain'},
  ];

  getReply(replyId: number): Promise<Reply> {
    return Promise.resolve(FakeReplyService.fakeReplies[0]);
  }

  likeReply(replyId: number): Promise<number> {
    return Promise.resolve(200);
  }

  report(reply: Reply): Promise<number> {
    return Promise.resolve(200);
  }

  deleteReply(replyId: number): Promise<number> {
    return Promise.resolve(200);
  }

}
