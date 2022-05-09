import { Component, OnInit } from '@angular/core';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { Category } from 'src/app/users/category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css'],
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  page = 1;
  pageSize = 5;
  addCat = false;

  constructor(
    private fireService: FirebaseInstanceService,
    private toastr: ToastrService
  ) {
    this.getCategories();
  }

  ngOnInit(): void {}

  getCategories() {
    this.fireService.getAllCategories().subscribe((category) => {
      this.categories = category;
    });
  }

  addCategory(category: string) {
    let catName : string = (category.charAt(0).toUpperCase() + category.slice(1,category.length).toLowerCase())
    let data = { Name: catName };
    this.fireService.create(data, 'category').subscribe(() => {
      this.toastr.success('Category : ' + data.Name + ' added succesfully!!');
      this.addCat = false
    });
  }

  delCategory(category) {
    if (
      confirm(
        'Are you sure you want to delete ' +
          category.Name +
          ' from the database?'
      )
    ) {
      this.fireService.delCategory(category.id).then(() => {
        this.toastr.success(
          'Category ' + category.Name + ' Deleted Successfully!',
          'Success'
        );
      });
    }
  }
}
