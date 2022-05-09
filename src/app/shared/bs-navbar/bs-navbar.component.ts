import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';

import { FirebaseInstanceService } from '../../firebase-instance.service';
import { ShoppingCartService } from '../../shopping-cart.service';
import { Product } from '../../users/product';

@Component({
  selector: 'app-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css'],
})
export class BsNavbarComponent implements OnInit {
  isMenuCollapsed = true;
  user: User;
  products: Product[] = [];
  productsList: Product[] = [];
  totalQuantity = 0;
  isAdmin : number = 0;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private fireService: FirebaseInstanceService,
    private cartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.fireService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.getTotalQuantity(user);
      this.isAdmin = parseInt(localStorage.getItem("admin"));
    });
  }

  async getTotalQuantity(user) {
    if (user) {
      this.cartService.getCart(user.uid).subscribe((cart) => {
        this.totalQuantity = 0;
        cart.map((item) => {
          this.totalQuantity += item['quantity'];
        });
      });
    } else {
      let cartItems = await this.cartService.getCartItemsFromLocalStorage();
      this.totalQuantity = 0;
      if (cartItems)
        cartItems.map((item) => {
          this.totalQuantity += item.quantity;
        });
      this.cartService.cartQty.subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
    }
  }

  logout() {
    this.isMenuCollapsed = true;
    this.auth.signOut().then(() => {
      this.router.navigate(['/']);
      location.reload();
      localStorage.removeItem('admin');
    });
  }
}
