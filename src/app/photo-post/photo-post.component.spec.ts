import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { PhotoPostComponent } from './photo-post.component';

import { AppModule } from '../app.module';
import { AppRoutingModule } from '../app-routing.module';

import { User } from '../models/user';
import { UserService } from '../models/user.service';

//var USER: User;
const USER: User = { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 0, total_likes: 1 };
//const user2: User = { user_id: 2, username: 'bb', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 }

let comp: PhotoPostComponent;
let fixture: ComponentFixture<PhotoPostComponent>;
let page: Page;

let router = {
	navigate: jasmine.createSpy('navigate')
};
let location = {
	back: jasmine.createSpy('back')
};

class Page {
	title: string;
	constructor() {
		this.title = fixture.debugElement.nativeElement.querySelector('h1').textContent;
	}
}

/*class MockHTMLInput {
	files: Array<File>;
	constructor() {
		this.files = new Array<File>();
		let content = "hello world";
		let data = new Blob([content], {type: 'text/plain'});
		let arrayOfBlob = new Array<Blob>();
		arrayOfBlob.push(data);
		let file = new File(arrayOfBlob, "Mock.csv");
		this.files.push(file);
	}
}*/

class FakeUserService {
	getUser(): Promise<User> {
		return Promise.resolve(USER);
	}
}

describe('PhotoPostComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AppModule
			],
		}).overrideModule(AppModule, {
			remove: {
				providers: [
					UserService
				]
			},
			add: {
				providers: [
					{ provide: UserService, useClass: FakeUserService },
					{ provide: Router, useValue: router },
					{ provide: Location, useValue: location }
				]
			}
		}).compileComponents()
		.then(() => {
			fixture = TestBed.createComponent(PhotoPostComponent);
			fixture.detectChanges();
			comp = fixture.componentInstance;
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				fixture.detectChanges();
				page = new Page();
			});
		});
	}));

	it('can instantiate it', () => {
		expect(comp).not.toBeNull();
	});

	it('should create the app', async(() => {
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));

	it('should go back when today-write-count is zero', fakeAsync(() => {
		const app = fixture.debugElement.componentInstance;
		spyOn(window, 'alert');
		app.ngOnInit();
		tick();
		expect(router.navigate).toHaveBeenCalled();
	}));

/*	it('should read proper url', async(() => {
		const app = fixture.debugElement.componentInstance;
		const sampleFile = new MockHTMLInput();
		let event = {
			target: {
				files: sampleFile.files,
				result: 'some/url'
			}
		};
		app.readUrl(event);
		expect(app.url).toBe('some/url');
	}));*/

	it('should redirect when sky picture is uploaded', fakeAsync(() => {
		var app = fixture.debugElement.componentInstance;
		app.upload_observable = () => Observable.of(201);
		app.upload();
		tick();
		expect(router.navigate).toHaveBeenCalled();
	}));

	it('should alert when non-sky picture is uploaded', fakeAsync(() => {
		var app = fixture.debugElement.componentInstance;
		spyOn(window, 'alert');
		app.upload_observable = () => Observable.of(406);
		app.upload();
		tick();
		expect(window.alert).toHaveBeenCalledWith('Our detective plane says that it is not sky!');
	}));

/*	it('should alert when tag is empty', fakeAsync(() => {
		var app = fixture.debugElement.componentInstance;
		console.log(app.log);
		spyOn(window, 'alert');
		app.tag = '';
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			app.upload_observable();
			tick();
			expect(window.alert).toHaveBeenCalledWith('Tag is empty. Please fill in tag!');
		});
	}));

	it('should alert when file exceeds 2MB', async(() => {
		var app = fixture.debugElement.componentInstance;
		spyOn(window, 'alert');

	}));*/
});