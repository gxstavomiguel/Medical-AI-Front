import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nova-senha-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './nova-senha-component.html',
})
export class NovaSenhaComponent implements OnInit {
  newPasswordForm: FormGroup;
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
  ) {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    const raw = localStorage.getItem('requires_password_change');
    if (raw === 'false') {
      this.router.navigate(['/home']);
    }
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  async onSubmit() {
    if (this.newPasswordForm.invalid || this.loading) return;

    const { password, confirmPassword } = this.newPasswordForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.auth.atualizarSenha(password);
    } catch (error: any) {
      console.error('Erro ao atualizar senha', error);
      this.errorMessage = error.message || 'Erro ao atualizar senha. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}
