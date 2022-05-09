import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private fireService: FirebaseInstanceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl(''),
      }),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  register() {
    const { username, email, password } = this.registerForm.value;
    let userData;
    let first : string = (username.firstName.charAt(0).toUpperCase() + username.firstName.slice(1,username.firstName.length).toLowerCase())
    let last : string = (username.lastName.charAt(0).toUpperCase() + username.lastName.slice(1,username.lastName.length).toLowerCase())
    let name = first + " " + last;
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.user.updateProfile({
          displayName: name
        })
        userData = {
          Email: email,
          Name: name,
          isAdmin: false,
          id: user.user.uid,
        };
        this.fireService.create(userData, 'users').subscribe(() => {
          this.toastr.success('User registered successfully!');
          this.router.navigate(['/login']);
        });
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }
}
