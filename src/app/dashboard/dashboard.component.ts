import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  users: User[];
  user: User;
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    const id = +localStorage.getItem('uid');
    this.userService.getUserById(id)
      .subscribe((user) => {
        this.user = user;
      });
  }

}
