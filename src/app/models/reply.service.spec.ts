import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Plane } from './plane';
import { Reply } from './reply';
import { ReplyService } from './reply.service';

const user1Replies = [
  { reply_id: 1, plane_author: 1, reply_author: 2, content: 'reply1', original_content: 'aaa', original_tag: 'aaa', is_reported: false, level: 'Plain'},
  { reply_id: 2, plane_author: 1, reply_author: 3, content: 'reply2', original_content: 'bbb', original_tag: 'bbb', is_reported: false, level: 'Plain'},
] as Reply[];

const replyData = { reply_id: 1, plane_author: 1, reply_author: 2, content: 'reply1', original_content: 'aaa', original_tag: 'aaa', is_reported: false, level: 'Plain'} as Reply;
const planeData = { author_id: 1, plane_id: 0, content: 'aaa', tag: 'aaa', level: 'Plain' } as Plane;

describe('ReplyService (mockBackend)', () => {

  beforeEach( async(() => { // We wrap it in async, because we want to compile modules and external files (like HTML, CSS) asynchronously.
    TestBed.configureTestingModule({ // TestBed configures modules, as in our AppModule, but for this test only.
      imports: [ HttpModule ],
      providers: [
        ReplyService,
        { provide: XHRBackend, useClass: MockBackend } // We don't have a backend here, so we 'mock' one for this service.
      ]
    })
      .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([ReplyService], (service: ReplyService) => { // one way of 'injecting' PlaneService for us to test.
      expect(service instanceof ReplyService).toBe(true);
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => { // a way of providing a mock backend that produces http responses.
      expect(backend).not.toBeNull('backend should be provided');
    }));

  describe('Get the Reply By Id', () => {
    let backend: MockBackend;
    let service: ReplyService;
    let fakeReply: Reply;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ReplyService(http);
      fakeReply = replyData;
      let options = new ResponseOptions({status: 200, body: fakeReply});
      response = new Response(options);
    }));

    it('should have expected fake reply', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getReply(fakeReply.reply_id)
        .then(reply => {
          expect(reply.reply_id).toBe(fakeReply.reply_id,
            'should have the same reply_id');
          expect(reply.plane_author).toBe(fakeReply.plane_author,
            'should have the same plane_author_id');
          expect(reply.reply_author).toBe(fakeReply.reply_author,
            'should have the same reply_author_id');
          expect(reply.content).toBe(fakeReply.content,
            'should have the same content');
          expect(reply.original_content).toBe(fakeReply.original_content,
            'should have the same original content');
          expect(reply.original_tag).toBe(fakeReply.original_tag,
            'should have the same original tag');
          expect(reply.is_reported).toBe(fakeReply.is_reported,
            'should have the same is_reported');
        });
    })));
  });

  describe('Get Reply by user', () => {
    let backend: MockBackend;
    let service: ReplyService;
    let fakeReplies: Reply [];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ReplyService(http);
      fakeReplies = user1Replies;
      let options = new ResponseOptions({status: 200, body: fakeReplies});
      response = new Response(options);
    }));

    it('should have expected no. fake user\'s replies', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getReplyByUser(1)
        .then(replies => {
          expect(replies.length).toBe(fakeReplies.length,
            'should have the same no. of user\'s replies');
        });
    })));
  });

  describe('Report & Like & Delete Replies', () => {
    let backend: MockBackend;
    let service: ReplyService;
    let fakeReply: Reply;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ReplyService(http);
      fakeReply = replyData;
      let options = new ResponseOptions({status: 200, body: {reply_id: fakeReply.reply_id}});
      response = new Response(options);
    }));

    it('should have reported the reply', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.report(fakeReply)
        .then(response => {
          expect(response).toBe(200);
        });
    })));

    it('should have liked the reply', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.likeReply(fakeReply.reply_id)
        .then(response => {
          expect(response).toBe(200);
        });
    })));

    it('should have deleted the reply', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.deleteReply(fakeReply.reply_id)
        .then(response => {
          expect(response).toBe(200);
        });
    })));
  });

  describe('Fold a New Reply', () => {
    let backend: MockBackend;
    let service: ReplyService;
    let fakePlane: Plane;
    let replyContent: string;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ReplyService(http);
      fakePlane = planeData;
      replyContent = 'new reply';
      let options = new ResponseOptions({status: 201, body: {
          plane_author: fakePlane.author_id,
          original_content: fakePlane.content,
          original_tag: fakePlane.tag,
          content: replyContent
        }});
      response = new Response(options);
    }));

    it('should have folded the new reply', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.foldNewReply(fakePlane, replyContent)
        .then(response => {
          expect(response).toBe(201);
        });
    })));
  });
});
