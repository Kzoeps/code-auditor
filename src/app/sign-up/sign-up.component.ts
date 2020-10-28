import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private fb: FormBuilder) {
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

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.userForm.value.password === this.userForm.value.confirmPassword) {
      this.passwordsMatch = true;
      console.warn(this.userForm.value);
    } else {
      this.passwordsMatch = false;
    }
  }

}
