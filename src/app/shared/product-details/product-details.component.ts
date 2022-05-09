import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { Product } from 'src/app/users/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId : string;
  product: Product;
  currentUserId: string;

  constructor(private route: ActivatedRoute, private fireService: FirebaseInstanceService) {
    this.productId = this.route.snapshot.paramMap.get("id");   
    this.getProduct();
    this.fireService.getCurrentUser().subscribe((user) => {
      if(user)
      this.currentUserId = user.uid
    });
   }

  ngOnInit(): void {
  }

  getProduct(){
    this.fireService.getAllProducts().pipe(
      map(product => product.filter(item => item.id === this.productId))
    ).subscribe(prod => this.product = prod[0]);
  }

}
