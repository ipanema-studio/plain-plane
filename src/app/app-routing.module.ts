import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardSignedInService } from './models/auth-guard-signed-in.service';
import { AuthGuardSignedOutService } from './models/auth-guard-signed-out.service';
import { AuthGuardWriteLeftService } from './models/auth-guard-write-left.service';
import { AuthGuardReplyLeftService } from './models/auth-guard-reply-left.service';

import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FindPasswordComponent } from './find-password/find-password.component';
import { PlanesComponent } from './planes/planes.component';
import { PlanesNearMeComponent } from './planes-near-me/planes-near-me.component';
import { ReplyComponent } from './reply/reply.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoPostComponent } from './photo-post/photo-post.component';
import { WriteComponent } from './write/write.component';
import { MyPageComponent } from './my-page/my-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RepliedPlaneComponent } from './replied-plane/replied-plane.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainPageComponent, canActivate: [AuthGuardSignedOutService], pathMatch: 'full' },
  { path: 'sign_up', component: SignUpComponent, canActivate: [AuthGuardSignedOutService], pathMatch: 'full' },
  { path: 'find_password', component: FindPasswordComponent, canActivate: [AuthGuardSignedOutService], pathMatch: 'full' },
  { path: 'planes', component: PlanesComponent, canActivate: [AuthGuardSignedInService], pathMatch: 'full' },
  { path: 'planes_near_me', component: PlanesNearMeComponent, canActivate: [AuthGuardSignedInService], pathMatch: 'full' },
  { path: 'plane/:id', component: ReplyComponent, canActivate: [AuthGuardSignedInService, AuthGuardReplyLeftService], pathMatch: 'full' },
  { path: 'gallery', component: PhotoListComponent, pathMatch: 'full' },
  { path: 'gallery/post', component: PhotoPostComponent, canActivate: [AuthGuardSignedInService, AuthGuardWriteLeftService], pathMatch: 'full' },
  { path: 'gallery/:id', component: PhotoDetailComponent, pathMatch: 'full' },
  { path: 'write', component: WriteComponent, canActivate: [AuthGuardSignedInService, AuthGuardWriteLeftService], pathMatch: 'full' },
  { path: 'my_page', component: MyPageComponent, canActivate: [AuthGuardSignedInService], pathMatch: 'full' },
  { path: 'reply/:id', component: RepliedPlaneComponent, canActivate: [AuthGuardSignedInService], pathMatch: 'full' },
  { path: 'change_password', component: ChangePasswordComponent, canActivate: [AuthGuardSignedInService], pathMatch: 'full'},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
