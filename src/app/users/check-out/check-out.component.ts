import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { OrderService } from 'src/app/order.service';
import { ShoppingCartService } from 'src/app/shopping-cart.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements OnInit {
  shippingForm: FormGroup;
  currentUserId: string;
  cart;
  totalPrice: number;
  quantityPrice: number;
  totalQuantity: number;
  order;
  totalQuantityMsg: string;

  constructor(
    private fireService: FirebaseInstanceService,
    private cartService: ShoppingCartService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.shippingForm = new FormGroup({
      Name: new FormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z][a-zA-Z ]+'),
      ]),
      Address: new FormGroup({
        AddLine1: new FormControl(null),
        AddLine2: new FormControl(null),
      }),
      City: new FormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z ]+'),
      ]),
      State: new FormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z ]+'),
      ]),
      Pincode: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9 ]+'),
      ]),
    });
  
    this.fireService.getCurrentUser().subscribe(user => {
      if(user){
        this.getCartItems(user.uid);
        this.currentUserId = user.uid;
      }
      else{
        this.getCartItems(null);
        this.currentUserId = null;
      }
    })
  }

  getCartItems(currentUserId) {
    this.cartService.getCart(currentUserId).subscribe((cart) => {
      this.cart = cart;
      this.totalPrice = 0;
      this.totalQuantity = 0;
      this.orderDetails();
    });
  }

  orderDetails() {
    this.order = {
      datePlaced: new Date().getTime(),
      shipping: this.shippingForm.value,
      items: this.cart.map((i) => {
        this.quantityPrice = 0;
        this.totalQuantity += i.quantity;
        this.quantityPrice += i.quantity * i.product.Price;
        this.totalPrice += this.quantityPrice;
        return {
          product: {
            Name: i.product.Name,
            ImageUrl: i.product.ImageUrl,
            Price: i.product.Price,
          },
          quantity: i.quantity,
          price: this.quantityPrice,
        };
      }),
      userId: this.currentUserId,
    };
    this.totalQuantityMsg = this.totalQuantity === 1 ? 'item' : 'items';
  }

  async placeOrder() {
    this.order.shipping = this.shippingForm.value;
    let result = await this.orderService.storeOrder(this.order);
    this.cartService.clearCart(this.currentUserId);
    this.shippingForm.reset();
    this.toastr.success('Order Placed Successfully!', 'Success');
    setTimeout(() => this.router.navigate(['/']), 1000);
  }
}
