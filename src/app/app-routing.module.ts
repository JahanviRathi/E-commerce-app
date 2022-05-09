import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './firebase-authentication/forgot-password/forgot-password.component';
import { LoginComponent } from './firebase-authentication/login/login.component';
import { RegisterComponent } from './firebase-authentication/register/register.component';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { SetPasswordComponent } from './firebase-authentication/set-password/set-password.component';
import { ShoppingCartComponent } from './users/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './users/check-out/check-out.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { MyOrdersComponent } from './users/my-orders/my-orders.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AddProductsComponent } from './admin/add-products/add-products.component';
import { ProductsComponent } from './products/products.component';
import { WishlistComponent } from './users/wishlist/wishlist.component';
import { ProductDetailsComponent } from './shared/product-details/product-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationGuard } from './authentication.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const redirectUnauthorizedToLogin = (next:ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectUnauthorizedTo(`/login?redirectTo=${state.url}`);
}

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'wishlist/:id',
    component: WishlistComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'check-out',
    component: CheckOutComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'my/orders',
    component: MyOrdersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/products/new',
    component: AddProductsComponent,
    canActivate: [AngularFireAuthGuard , AuthenticationGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/products/:id',
    component: AddProductsComponent,
    canActivate: [AngularFireAuthGuard, AuthenticationGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [AngularFireAuthGuard, AuthenticationGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    canActivate: [AngularFireAuthGuard, AuthenticationGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/categories',
    component: AdminCategoriesComponent,
    canActivate: [AngularFireAuthGuard, AuthenticationGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {path:"**" , component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
