import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from './sign-up/sign-up.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {UsersComponent} from './users/users.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {AddUserComponent} from './add-user/add-user.component';
import {TeamComponent} from './team/team.component';
import {AddTeamComponent} from './add-team/add-team.component';
import {TeamDetailsComponent} from './team-details/team-details.component';
import {AuditComponent} from './audit/audit.component';
import {AddAuditComponent} from './add-audit/add-audit.component';
import {AuditDetailComponent} from './audit-detail/audit-detail.component';
import {AuthGuard} from './auth.guard';
import {RoleGuard} from './role.guard';

const routes: Routes = [
  {path: 'sign-up', component: SignUpComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'user-detail/:id', component: UserDetailComponent, canActivate: [AuthGuard]},
  {path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'teams', component: TeamComponent, canActivate: [AuthGuard]},
  {path: 'add-team', component: AddTeamComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'team-detail/:id', component: TeamDetailsComponent, canActivate: [AuthGuard]},
  {path: 'audit', component: AuditComponent, canActivate: [AuthGuard]},
  {path: 'add-audit', component: AddAuditComponent, canActivate: [AuthGuard]},
  {path: 'audit-detail/:id', component: AuditDetailComponent, canActivate: [AuthGuard]}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule {
}
