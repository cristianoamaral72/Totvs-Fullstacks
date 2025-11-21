import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';

// Seu componente de loader

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // Material
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,

    // Forms
    ReactiveFormsModule,
    FormsModule,

    // Router
    RouterModule,

    // Loader
    LoaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {


  formularioLogin!: FormGroup;
  mensagemErro: string = '';
  loader: boolean = false;
  environment = environment;

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.formularioLogin = this.fb.group({
      username: ['master', Validators.required],
      password: ['123', Validators.required],
    });
  }

  entrar() {
    this.loader = true;
    this.mensagemErro = '';

    if (this.formularioLogin.invalid) {
      this.loader = false;
      this.mensagemErro = 'Preencha todos os campos.';
      return;
    }

    const { username, password } = this.formularioLogin.value;

    if (username === 'admin' && password === '123') {
      this.router.navigate(['/home']);
      return;
    }

    this.loader = false;
    this.mensagemErro = 'Usuário ou senha inválidos.';
  }

login() {
  this.loader = true;
  this.mensagemErro = '';

  if (this.formularioLogin.invalid) {
    this.loader = false;
    this.mensagemErro = 'Preencha todos os campos.';
    return;
  }

  const { username, password } = this.formularioLogin.value;

  // Login fictício (trocar por API real)
  if (username === 'master' && password === '123') {
    this.router.navigate(['/home']);
    return;
  }

  this.loader = false;
  this.mensagemErro = 'Usuário ou senha inválidos.';
}


}
