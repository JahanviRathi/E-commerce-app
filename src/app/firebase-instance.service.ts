import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { from, map, Observable, Subject } from 'rxjs';
import { Users } from './firebase-authentication/users';
import { Category } from './users/category';
import { Product } from './users/product';

@Injectable({
  providedIn: 'root',
})
export class FirebaseInstanceService {
  private productCollection: AngularFirestoreCollection<Product>;
  private categoriesCollection: AngularFirestoreCollection<Category>;
  private usersCollection: AngularFirestoreCollection<Users>;

  
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.productCollection = firestore.collection<Product>('products');
    this.categoriesCollection = firestore.collection<Category>(
      'categories',
      (ref) => ref.orderBy('Name')
    );
    this.usersCollection = firestore.collection<Users>('users');
  }

  create(data, type): Observable<DocumentReference> {
    if (type === 'product') return from(this.productCollection.add(data));
    else if (type === 'category')
      return from(this.categoriesCollection.add(data));
    else if (type === 'users') return from(this.usersCollection.add(data));
  }

  getAllProducts() {
    return this.productCollection
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((data) => ({
            id: data.payload.doc.id,
            ...data.payload.doc.data(),
          }))
        )
      )
  }

  getAllCategories() {
    return this.categoriesCollection.snapshotChanges()
    .pipe(
      map((changes) =>
        changes.map((data) => ({
          id: data.payload.doc.id,
          ...data.payload.doc.data(),
        }))
      )
    );
  }

  getAllUsers() {
    return this.usersCollection.snapshotChanges()
    .pipe(
      map((changes) =>
        changes.map((data) => ({
          ...data.payload.doc.data(),
        }))
      )
    );
  }

  getCurrentUser(){
    return this.auth.authState;
  }

  updateProducts(id: string, data: any): Promise<void> {
    return this.productCollection.doc(id).update(data);
  }

  delProducts(id: string) {
    return this.productCollection.doc(id).delete();
  }

  delCategory(id: string) {
    return this.categoriesCollection.doc(id).delete();
  }
}
