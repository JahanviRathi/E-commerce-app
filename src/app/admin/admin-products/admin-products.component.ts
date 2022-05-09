import { Component, OnInit } from '@angular/core';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { Product } from 'src/app/users/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  productsList: Product[] = [];
  page = 1;
  pageSize = 8;

  constructor(
    private fireService: FirebaseInstanceService,
    private toastr: ToastrService
  ) {
    this.fireService.getAllProducts().subscribe((products) => {
      this.productsList = this.products = products;
    });
  }

  ngOnInit(): void {}

  delProduct(p: Product) {
    if (
      confirm(
        'Are you sure you want to delete ' + p.Name + ' from the database?'
      )
    ) {
      this.fireService.delProducts(p.id).then(() => {
        this.toastr.success('Item ' + p.Name + ' deleted successfully!!');
      });
    }
  }

  filter(query: string) {
    this.products = query
      ? this.productsList.filter((prod) =>
          prod.Name.toLowerCase().includes(query.toLowerCase())
        )
      : this.productsList;
  }
}
