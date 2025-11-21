import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

// Services / models
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    // Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  productId?: number;
  loading = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.productId = Number(idParam);
      this.loadProduct(this.productId);
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      active: [true]
    });
  }

  loadProduct(id: number): void {
    this.loading = true;

    this.productService.getById(id).subscribe({
      next: (product) => {
        product.id = id;
        this.form.patchValue(product);
        this.loading = false;
      },
      error: () => {
        this.error = 'Produto não encontrado.';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const product: Product = this.form.value;
    this.loading = true;

    const request$ = this.isEdit && this.productId
      ? this.productService.update(this.productId, product)
      : this.productService.create(product);

    request$.subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.error = 'Erro ao salvar produto.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  get f() {
    return this.form.controls;
  }
}
