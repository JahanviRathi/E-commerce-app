import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseInstanceService } from '../firebase-instance.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { Product } from '../users/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  allProducts: Product[] = [];
  products: Product[] = [];
  selectedCategory: string;
  cart;

  constructor(
    private fireService: FirebaseInstanceService,
    private route: ActivatedRoute
  ) {
    this.getProducts();
  }

  getProducts() {
    this.fireService.getAllProducts().subscribe((data) => {
      this.route.queryParamMap.subscribe((params) => {
        this.selectedCategory = params.get('category');
        this.allProducts = data;
        this.products = this.selectedCategory
          ? this.allProducts.filter(
              (product) => product.Category === this.selectedCategory
            )
          : this.allProducts;
        this.allProducts = this.products;
      });
    });
  }

  filter(query: string) {
    this.products = query
      ? this.allProducts.filter((prod) =>
          prod.Name.toLowerCase().includes(query.toLowerCase())
        )
      : this.allProducts;
  }

  sort(type: string, func: number) {
    if (type === 'alpha')
      this.products =
        func === -1
          ? this.products.sort((a, b) =>
              a.Name.toUpperCase() < b.Name.toUpperCase() ? 1 : -1
            )
          : this.products.sort((a, b) =>
              a.Name.toUpperCase() > b.Name.toUpperCase() ? 1 : -1
            );
    else
      this.products =
        func === -1
          ? this.products.sort((a, b) => (a.Price < b.Price ? 1 : -1))
          : this.products.sort((a, b) => (a.Price > b.Price ? 1 : -1));
  }
}
