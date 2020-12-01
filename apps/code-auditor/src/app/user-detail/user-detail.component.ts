import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../user';
import {ToastrService} from 'ngx-toastr';

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
    private toast: ToastrService
  ) {
  }

  user: User;
  isAdmin: boolean;
  isEditable: boolean;
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
    const id = this.route.snapshot.paramMap.get('id');
    if (localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('uid') === id) {
      this.isEditable = true;
    }
  }

  getUser(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(id)
      .subscribe(user => {
        this.user = user;
        if (user.email === 'admin@admin.com') {
          this.isAdmin = true;
        }
      });
  }

  updateUser(): void {
    this.userService.updateUser(this.user)
      .subscribe(() => {
        this.toast.success('Successfully updated!');
      });
  }
}
