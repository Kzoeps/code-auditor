import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  errorMsg: string;
  loggedIn: boolean;

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    let match = false;
    this.userService.getUsers()
      .subscribe((user) => {
        for (const eachUser of user) {
          if (eachUser.email === email && eachUser.password === password) {
            localStorage.setItem('isLoggedIn', 'true');
            match = true;
            this.errorMsg = '';
            this.router.navigate(['/dashboard']);
          }
        }
        if (!(match)) {
          this.errorMsg = 'Wrong Credentials';
        }
      });
  }

}
