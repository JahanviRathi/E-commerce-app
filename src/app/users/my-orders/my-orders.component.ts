import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
orderDetails;
  constructor(private fireService: FirebaseInstanceService, private orderService: OrderService) { 
    this.fireService.getCurrentUser().subscribe(user => {
      this.getOrder(user.uid);
    })
  }

  getOrder(userId : string){
    this.orderService.getOrder().pipe(map(order => order.filter(o => (o["userId"] === userId)))).subscribe(detail => {
      this.orderDetails = detail;
    })
  }

}
