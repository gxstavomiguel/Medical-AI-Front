import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../core/supabase.client';

@Component({
  selector: 'app-nova-senha-component',
  imports: [ReactiveFormsModule],
  templateUrl: './nova-senha-component.html'
})
export class NovaSenhaComponent {
  newPasswordForm: FormGroup;
  login: string = '';
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.login = params['login'];
    });

    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  async onSubmit() {
    if (this.newPasswordForm.invalid) return;

    const { password, confirmPassword } = this.newPasswordForm.value;

    if (password !== confirmPassword) return;

    try {
      await this.auth.atualizarSenha(password);
      this.router.navigate(['dashboard']);
    } catch (error) {
      console.error('Erro ao atualizar senha', error);
    }
  }



}
