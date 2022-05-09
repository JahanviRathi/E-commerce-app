import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { from, map} from 'rxjs';
import { Cart } from './cart';
import { Users } from './firebase-authentication/users';
import { Product } from './users/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private cartCollection: AngularFirestoreCollection<Cart>;
  private cartList = [];
  private totalQuantity = 0;
  cartQty = new BehaviorSubject(false);

  constructor(private firestore: AngularFirestore) {
    this.cartCollection = firestore.collection<Cart>('shopping-cart');
  }

  getCart(userId: string) {
    if (userId) {
      return this.cartCollection
        .doc(`${userId}`)
        .collection('items')
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((data) => ({
              id: data.payload.doc.id,
              ...data.payload.doc.data(),
            }))
          )
        );
    }else {
      return this.getCartItemsFromLocalStorage();
    }
  }

  // getTotalQuantity(userId) {
  //   if (userId) {
  //     this.getCart(userId).subscribe((cart) => {
  //       this.totalQuantity = 0;
  //       cart.map((item) => {
  //         this.totalQuantity += item['quantity'];
  //       });
  //     });
  //   } else {
  //     let cartItems = this.getCartItemsFromLocalStorage();
  //     this.totalQuantity = 0;
  //     cartItems.map((item) => {
  //       this.totalQuantity += item.quantity;
  //     });
  //   }
  //   this.cartQty.next(this.totalQuantity);
  //   return this.totalQuantity;
  // }

  addToCart(item, currentUser) {
    let item$ = this.cartCollection
      .doc(`${currentUser.uid}`)
      .collection('items')
      .doc(`${item.product.id}`);
    item$.get().subscribe((itemsList) => {
      if (itemsList.exists) {
        item$.update({
          product: item.product,
          quantity: (itemsList.data()['quantity'] || 0) + item.quantity,
        });
      } else {
        item$.set({ product: item.product, quantity: item.quantity });
      }
    });
  }

  async addToCartInFirestore(product: Product, currentUserId: string) {
    let item$ = this.cartCollection
      .doc(`${currentUserId}`)
      .collection('items')
      .doc(`${product.id}`);
    item$.get().subscribe((itemsList) => {
      if (itemsList.exists) {
        item$.update({
          product: product,
          quantity: (itemsList.data()['quantity'] || 0) + 1,
        });
      } else {
        item$.set({ product: product, quantity: 1 });
      }
    });
  }

  async addToCartInLocalStorage(product: Product) {
    let cart = JSON.parse(localStorage.getItem('data'));
    let data = { product: product, quantity: 1 };
    if (cart) {
      this.cartList = cart;
      let existingItem = this.cartList
        .filter((item) => item.product.id === product.id)
        .map((item) => item.quantity++);
      if (existingItem.length === 0) {
        this.cartList.push(data);
      }
    } else {
      this.cartList = [];
      this.cartList.push(data);
    }
    localStorage.setItem('data', JSON.stringify(this.cartList));
    this.cartQty.next(true);
  }

  public getCartItemsFromFirestore(currentUserId) {
    return this.cartCollection
      .doc(`${currentUserId}`)
      .collection('items')
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((data) => ({
            ...data.payload.doc.data(),
          }))
        )
      );
  }

  public getCartItemsFromLocalStorage() {
    let cartItems = JSON.parse(localStorage.getItem('data'));
    return cartItems;
  }

  public removeFromFireStore(product: Product, currentUserId: string) {
    let item$ = this.cartCollection
      .doc(`${currentUserId}`)
      .collection('items')
      .doc(`${product.id}`);
    item$.get().subscribe((itemsList) => {
      item$.update({
        product: product,
        quantity: itemsList.data()['quantity'] - 1,
      });
      if (itemsList.data()['quantity'] === 1) item$.delete();
    });
  }

  removeFromLocalStorage(product: Product) {
    let cart = JSON.parse(localStorage.getItem('data'));
    this.cartList = cart;
    this.cartList
      .filter((item) => item.product.id === product.id)
      .map((item) => {
        item.quantity--;
        if (item.quantity === 0)
          this.cartList = this.cartList.filter(
            (item) => item.product.id != product.id
          );
      });
    localStorage.setItem('data', JSON.stringify(this.cartList));
    this.cartQty.next(true);
  }

  async clearCart(userId: string) {
    let item$ = await this.cartCollection
      .doc(`${userId}`)
      .collection('items')
      .ref.get();

    item$.forEach((doc) => doc.ref.delete());
    this.cartQty.next(true);
  }
}
