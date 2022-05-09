import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/shopping-cart.service';
import { Product } from '../product';
import { ToastrService } from 'ngx-toastr';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  currentUserId;
  cartItems;
  totalQuantity = 0;
  totalQuantityMsg;
  totalPrice = 0;

  constructor(
    private cartService: ShoppingCartService,
    private fireService: FirebaseInstanceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fireService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.getTotalQuantity(user.uid);
        this.getCart(user.uid);
      } else {
        this.currentUserId = null;
        this.getTotalQuantity(null);
        this.getCart(null);
      }
    });
  }

  async getCart(userId) {
    if (userId) {
      this.cartService.getCartItemsFromFirestore(userId).subscribe((item) => {
        this.cartItems = item;
      });
    } else {
      this.cartItems = await this.cartService.getCartItemsFromLocalStorage();
    }
  }

  async getTotalQuantity(userId) {
    if (userId) {
      this.cartService.getCart(userId).subscribe((cart) => {
        this.totalQuantity = 0;
        this.totalPrice = 0;
        cart.map((item) => {
          this.totalQuantity += item['quantity'];
          this.totalPrice += item['quantity'] * item['product'].Price;
          this.totalQuantityMsg = this.totalQuantity === 1 ? 'item' : 'items';
        });
      });
    } else {
      let cartItems = await this.cartService.getCartItemsFromLocalStorage();
      this.totalQuantity = 0;
      this.totalPrice = 0;
      if (cartItems)
        cartItems.map((item) => {
          this.totalQuantity += item.quantity;
          this.totalPrice += item['quantity'] * item['product'].Price;
          this.totalQuantityMsg = this.totalQuantity === 1 ? 'item' : 'items';
        });
    }
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      if (this.currentUserId) {
        this.cartService.clearCart(this.currentUserId);
        this.toastr.success('Cart cleared successfully!!');
      } else {
        localStorage.removeItem('data');
        // this.cartService.cartQty.subscribe((res) => {
        //   if (res) {
        //     this.getTotalQuantity(null);
        //     this.getCart(null);
        //   }
        // });
        location.reload();
        this.toastr.success('Cart cleared successfully!!');
      }
    }
  }

  removeFromCart(product: Product) {
    if (
      confirm('Are you sure you want to remove ' + product.Name + ' your cart?')
    ) {
      if (this.currentUserId) {
        this.cartService.removeFromFireStore(product, this.currentUserId);
        this.toastr.success(product.Name + ' removed from cart successfully!!');
      } else {
        this.cartService.removeFromLocalStorage(product);
        // this.cartService.cartQty.subscribe((res) => {
        //   if (res) {
        //     this.getTotalQuantity(null);
        //     this.getCart(null);
        //   }
        // });
        location.reload()
        this.toastr.success(product.Name + ' removed from cart successfully!!');
      }
    }
  }
}
