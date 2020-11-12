import {Component, Input, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../user.service';
import {User} from '../user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
// TODO: put toast onSubmit
export class SignUpComponent implements OnInit {

  @Input() fromAddUser: boolean;
  user: User;
  doesUserExist: User[];

  constructor(private userService: UserService, private fb: FormBuilder) {
  }

  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required]
  });
  passwordsMatch = true;
  isEmailValid = true;

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.userForm.value.password === this.userForm.value.confirmPassword) {
      this.passwordsMatch = true;
      this.userForm.value.email = this.userForm.value.email.trim();
      this.user = this.userForm.value;
      this.user.leadOnTeams = [];
      this.user.memberOnTeams = [];
      this.userService.getUser(this.userForm.value.email)
        .subscribe(user => {
          this.doesUserExist = user;
          if (this.doesUserExist.length !== 0) {
            this.isEmailValid = false;
          } else {
            this.userService.registerUser(this.user)
              .subscribe(() => {
                console.log('user registered, toast heere');
              });
            this.isEmailValid = true;
          }
        });
    } else {
      this.passwordsMatch = false;
    }
  }

}
