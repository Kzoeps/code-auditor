import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../user';

// TODO: Validations to make sure min length and also no blanks
// TODO: toast on updateUser()
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  user: User;
  roles = [
    'Frontend',
    'Backend',
    'Quality Assurance',
    'User Interface',
    'Business Analyst',
    'Project Manager'
  ];

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(id)
      .subscribe(user => {
        this.user = user;
      });
  }

  updateUser(): void {
    this.userService.updateUser(this.user)
      .subscribe();
  }
}
