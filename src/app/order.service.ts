import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderCollection: AngularFirestoreCollection<Order>;

  constructor(private firestore: AngularFirestore) { 
    this.orderCollection = firestore.collection("orders");
  }

  storeOrder(order){
    return this.orderCollection.add(order);
  }

  getOrder(){
    return this.orderCollection.snapshotChanges().pipe(
      map(changes => changes.map(data => ({
        id: data.payload.doc.id,
        ...data.payload.doc.data()
      })))
    )
  }
}
