import { Component, Input} from '@angular/core';
import { Product } from '../../users/product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() public product: Product;
  @Input() public showActions: boolean;

  constructor() {}
}
