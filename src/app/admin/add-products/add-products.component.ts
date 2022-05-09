import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { Category } from 'src/app/users/category';
import { ToastrService } from "ngx-toastr"

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  id: string;
  text: string = 'Add';

  constructor(
    private fireService: FirebaseInstanceService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.productForm = new FormGroup({
      Name: new FormControl(null, Validators.required),
      Description: new FormControl(null),
      Category: new FormControl(null, Validators.required),
      SubCategory: new FormControl(null),
      Price: new FormControl(null, Validators.required),
      ImageUrl: new FormControl(null),
    });
    this.getCategories();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getOneProduct(this.id).subscribe((p) => {
        this.productForm.patchValue({
          Name: p.Name,
          Description: p.Description,
          Category: p.Category,
          SubCategory: p.SubCategory,
          Price: p.Price,
          ImageUrl: p.ImageUrl,
        });
        this.text = 'Edit';
      });
    } else {
      this.text = 'Add';
    }
  }

  ngOnInit(): void {}

  addProduct() {
    let data = this.productForm.value;
    if (this.id) this.fireService.updateProducts(this.id, data).then(() => {});
    else this.fireService.create(data, 'product').subscribe((res) => {});
    this.productForm.reset();
    this.toastr.success(data.Name + " added successfully!!")
    this.router.navigate(['/admin/products']);
  }

  getCategories() {
    this.fireService
      .getAllCategories()
      .subscribe((data) => {
        this.categories = data;
      });
  }

  getOneProduct(productId) {
    return this.fireService
      .getAllProducts()
      .pipe(
        map((p) => p.find((prod) => prod.id === productId))
      );
  }
}
