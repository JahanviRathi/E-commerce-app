import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { Category } from 'src/app/users/category';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {

  categories: Category[] = [];
  @Input() public selectedCategory: string;

  constructor(private fireService: FirebaseInstanceService) {
    this.getCategories();
   }

  getCategories() {
    this.fireService
      .getAllCategories()
      .subscribe((data) => {
        this.categories = data;
      });
  }


}
