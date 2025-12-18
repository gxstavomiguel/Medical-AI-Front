import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../core/supabase.client';
import { environment } from '../environments/environment.supabase';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  async login(login: string, senha: string) {
    const response = await this.http.post<{
      access_token: string;
      refresh_token: string;
      user_id: string;
      primeiro_acesso: boolean;
    }>(`${environment.n8nUrl}/login`, { login, senha }).toPromise();

    if (!response) throw new Error('Login failed');

    localStorage.setItem('usuario_id', response.user_id);

    localStorage.setItem('authToken', response.access_token);

    const { error } = await supabase.auth.setSession({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });

    if (error) throw error;

    if (response.primeiro_acesso) {
      this.router.navigate(['/nova-senha']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  async isLoggedIn(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  async getToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async atualizarSenha(novaSenha: string) {
    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) throw error;
  }
}
