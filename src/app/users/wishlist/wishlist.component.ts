import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { Wishlist } from 'src/app/wishlist';
import { WishlistService } from 'src/app/wishlist.service';
import { Product } from '../product';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  id: string;
  userId: string;
  product: Product;
  items = [];
  wishlistItems = 0;
  msg: string;

  constructor(
    private route: ActivatedRoute,
    private fireService: FirebaseInstanceService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fireService.getCurrentUser().subscribe((user) => {
      this.userId = user.uid;
    });
    this.fireService
      .getAllProducts()
      .pipe(map((item) => item.find((i) => i.id === this.id)))
      .subscribe((item) => {
        this.product = item;
        this.wishlistService.addToWishlist(this.product, this.userId);
      });

    setTimeout(() => this.getWishlist(), 1000);
  }

  getWishlist() {
    this.wishlistService.getAllWishlist(this.userId).subscribe((item) => {
      this.items = item;
      this.wishlistItems = this.items.length;
      this.msg = this.wishlistItems === 1 ? 'item' : 'items';
    });
  }

  removeFromWishlist(product: Wishlist) {
   if(confirm("Do you want to remove " + product.product.Name + " from wishlist?"))
   {
    this.wishlistService.removeItem(product, this.userId);
    this.toastr.success(product.product.Name + " removed from wishlist successfully!!")
   }
    
  }
}
