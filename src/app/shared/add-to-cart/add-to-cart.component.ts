import { Component, Input } from '@angular/core';
import { ShoppingCartService } from 'src/app/shopping-cart.service';
import { Product } from 'src/app/users/product';
import { ToastrService } from 'ngx-toastr';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css'],
})
export class AddToCartComponent {
  @Input() public product: Product;

  currentUserId: string;
  cartItems;
  quantity = 0;

  constructor(
    private cartService: ShoppingCartService,
    private fireService: FirebaseInstanceService,
    private toastr: ToastrService
  ) {
    this.fireService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.getQuantity(user.uid);
      } else {
        this.currentUserId = null;
        this.getQuantity(null);
      }
    });
  }

  addToCart() {
    if (this.currentUserId) {
      this.cartService.addToCartInFirestore(this.product, this.currentUserId);
      this.toastr.success(this.product.Name + ' added to cart successfully!!');
    } else {
      this.cartService.addToCartInLocalStorage(this.product);
      this.getQuantity(null);
      this.toastr.success(this.product.Name + ' added to cart successfully!!');
    }
  }

  async getQuantity(currentUserId: string) {
    if (currentUserId) {
      this.cartService
        .getCartItemsFromFirestore(currentUserId)
        .subscribe((item) => {
          this.cartItems = item;
          this.showQuantity();
        });
    } else {
      this.cartItems = await this.cartService.getCartItemsFromLocalStorage();
      this.showQuantity();
    }
  }

  showQuantity() {
    if (this.cartItems) {
      let itemsList = this.cartItems.find(
        (items) => items.product.id === this.product.id
      );
      if (itemsList) this.quantity = itemsList.quantity;
      else this.quantity = 0;
    }
  }

  removeFromCart() {
    if (this.currentUserId) {
      this.cartService.removeFromFireStore(this.product, this.currentUserId);
      this.toastr.success(
        this.product.Name + ' removed from cart successfully!!'
      );
    } else {
      this.cartService.removeFromLocalStorage(this.product);
      this.getQuantity(null);
      this.toastr.success(
        this.product.Name + ' removed from cart successfully!!'
      );
    }
  }
}
