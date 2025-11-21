import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsListComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/:id', component: ProductFormComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
