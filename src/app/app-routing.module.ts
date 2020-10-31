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

const routes: Routes = [
  {path: 'sign-up', component: SignUpComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user-detail/:id', component: UserDetailComponent},
  {path: 'add-user', component: AddUserComponent},
  {path: 'teams', component: TeamComponent},
  {path: 'add-team', component: AddTeamComponent},
  {path: 'team-detail/:id', component: TeamDetailsComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule {
}
