import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckOutComponent } from './check-out/check-out.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { WishlistComponent } from './wishlist/wishlist.component';

@NgModule({
  declarations: [
    CheckOutComponent,
    ShoppingCartComponent,
    MyOrdersComponent,
    WishlistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ]
})
export class UsersModule { }
