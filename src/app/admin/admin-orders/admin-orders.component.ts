import { Component, OnInit } from '@angular/core';
import { FirebaseInstanceService } from 'src/app/firebase-instance.service';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent {
  orderDetails;

  constructor(private orderService: OrderService, private fireService: FirebaseInstanceService) { 
    this.getOrder();
  }

  getOrder(){
    this.orderService.getOrder().subscribe(detail => {
      this.orderDetails = detail;
    })
  }

}
