import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { Users } from '../users';
import { ShoppingCartService } from 'src/app/shopping-cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  redirectUrl = this.route.snapshot.queryParamMap.get('redirectTo') || '/';
  users: Users[] = [];
  currentUser: Users;

  constructor(
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private fireService: FirebaseInstanceService,
    private cartService: ShoppingCartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
    this.getUsers();
  }

  getUsers() {
    this.fireService.getAllUsers().subscribe((user) => (this.users = user));
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.getCurrentUser();
        this.toastr.success('Login Successfully!!');
        this.router.navigateByUrl(this.redirectUrl);
      })
      .catch((err) => {
        this.toastr.error(err.code);
      });
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  getCurrentUser() {
    this.fireService.getCurrentUser().subscribe((user) => {
      this.currentUser = {
        Email: user.email,
        Name: user.displayName,
        isAdmin: false,
        id: user.uid,
      };
      let tempUser = this.users.find((u) => u.Email === this.currentUser.Email);
      if (!tempUser) this.fireService.create(this.currentUser, 'users');
    
      this.getDataFromLocalStorage(user);
    
      if (tempUser.isAdmin) localStorage.setItem('admin', '1');
      else localStorage.setItem('admin', '0');
    });
  }

  loginWithGoogle() {
    this.auth
      .signInWithPopup(new GoogleAuthProvider())
      .then(() => {
        this.getCurrentUser();
        this.toastr.success('Login Successfully!!');
        this.router.navigateByUrl(this.redirectUrl);
      })
      .catch((err) => {
        this.toastr.error(err.code);
      });
  }

  getDataFromLocalStorage(user) {
    let cartItems = JSON.parse(localStorage.getItem('data'));
    if (cartItems) {
      cartItems.map((item) => {
        this.cartService.addToCart(item, user);
      });
      localStorage.removeItem('data');
    }
  }
}
