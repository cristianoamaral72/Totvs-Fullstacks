import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,

    // Angular Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'stockQuantity', 'active', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  loading = false;
  error?: string;

  constructor(
    private productService: ProductService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar produtos.';
        this.snack.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  newProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(product: Product): void {
    if (!product.id) return;
    this.router.navigate(['/products', product.id]);
  }

  deleteProduct(product: Product): void {
    if (!product.id) return;
    const confirmDelete = confirm(`Tem certeza que deseja excluir "${product.name}"?`);
    if (!confirmDelete) return;
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.snack.open('Produto excluído com sucesso.', 'Fechar', { duration: 3000 });
        this.loadProducts();
      },
      error: () => {
        this.snack.open('Erro ao excluir produto.', 'Fechar', { duration: 3000 });
      }
    });
  }
}