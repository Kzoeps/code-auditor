import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NavComponent } from './nav/nav.component';
import { AddUserComponent } from './add-user/add-user.component';
import { TeamComponent } from './team/team.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { AuditComponent } from './audit/audit.component';
import { AddAuditComponent } from './add-audit/add-audit.component';
import { AuditDetailComponent } from './audit-detail/audit-detail.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    DashboardComponent,
    LoginComponent,
    UsersComponent,
    UserDetailComponent,
    NavComponent,
    AddUserComponent,
    TeamComponent,
    AddTeamComponent,
    TeamDetailsComponent,
    AuditComponent,
    AddAuditComponent,
    AuditDetailComponent,
  ],
    imports: [
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
    ],
  exports: [NavComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
