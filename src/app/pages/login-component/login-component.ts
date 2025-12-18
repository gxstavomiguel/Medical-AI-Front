import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarSenha: boolean = false;
  sloganDinamico: string = 'Plataforma inteligente no ensino médico';
  novo_usuario: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async onSubmit() {
    if (this.loginForm.invalid || this.loading) return;

    const { login, password } = this.loginForm.value;

    this.loading = true;
    this.errorMessage = '';
    try {
      await this.auth.login(login, password);
    } catch (error: any) {
      console.error('Erro ao logar', error);
      this.errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
    } finally {
      this.loading = false;
    }
  }

}
