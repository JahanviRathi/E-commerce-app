import { Component} from '@angular/core';
import { FirebaseInstanceService } from '../firebase-instance.service';
import { Category } from '../users/category';
import { Product } from '../users/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  categories: Category[] = [];
  allProducts: Product[] = [];
  products: Product[] = [];

  constructor(
    private fireService: FirebaseInstanceService
  ) {
    this.fireService
      .getAllCategories()
      .subscribe((cat) => (this.categories = cat));
    this.getProducts();
  }

  getProducts() {
    this.fireService.getAllProducts().subscribe((data) => {
      this.allProducts = data;
      this.categories.map((selectedCategory) => {
        let temp = selectedCategory
          ? this.allProducts.filter(
              (product) => product.Category === selectedCategory.Name
            )
          : this.allProducts;
        this.products.push(temp[0]);
      });
    });
  }
}
