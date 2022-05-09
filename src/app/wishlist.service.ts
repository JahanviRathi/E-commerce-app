import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Product } from './users/product';
import { Wishlist } from './wishlist';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistCollection: AngularFirestoreCollection<Wishlist>;
  constructor(
    private firestore: AngularFirestore,
    private toastr: ToastrService
  ) {
    this.wishlistCollection = firestore.collection<Wishlist>('wishlist');
  }

  addToWishlist(item: Product, currentUserId: string) {
    if (currentUserId) {
      let item$ = this.wishlistCollection
        .doc(`${currentUserId}`)
        .collection('items')
        .doc(`${item.id}`);
      item$.get().subscribe((itemList) => {
        if (itemList.exists) {
          this.toastr.error(
            itemList.data().product.Name + ' already present in wishlist!'
          );
        } else if(!itemList.exists) {
          item$.set({ product: item });
          this.toastr.success('Added To Wishlist!');
        }
      });
    }
  }

  getAllWishlist(userId: string) {
    return this.wishlistCollection
      .doc(`${userId}`)
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

  removeItem(wishlistProduct: Wishlist, userId: string) {
    this.wishlistCollection
      .doc(`${userId}`)
      .collection('items')
      .doc(`${wishlistProduct.product.id}`)
      .delete();
  }
}
