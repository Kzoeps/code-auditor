import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.passwords;
    this.userService.getUsers()
      .subscribe((user) => {
        for (const eachUser of user) {
          if (eachUser.email === email && eachUser.password === password) {
            localStorage.setItem('isLoggedIn', 'true');
          }
        }
      });
  }

}
