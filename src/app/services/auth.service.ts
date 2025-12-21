import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../core/supabase.client';
import { environment } from '../environments/environment.supabase';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  async login(login: string, password: string) {
    try {
      const response = await this.http
        .post<LoginResponse>(`${environment.n8nUrl}/login`, {
          email: login,
          login,
          password,
        })
        .toPromise();

      if (!response || !response.success) {
        throw new Error(response?.error?.message || 'Login failed');
      }

      localStorage.setItem('usuario_id', response.user.id);
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_email', response.user.email);
      localStorage.setItem('user_role', response.user.role);

      localStorage.setItem('requires_password_change', String(response.requires_password_change));

      if (response.user.name) {
        localStorage.setItem('user_name', response.user.name);
      }

      if (response.user.avatar_url) {
        localStorage.setItem('user_avatar', response.user.avatar_url);
      }

      const { error } = await supabase.auth.setSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      if (error) throw error;

      if (response.requires_password_change) {
        this.router.navigate(['/nova-senha']);
      } else {
        this.router.navigate(['/home']);
      }

      return response;
    } catch (error: any) {
      if (error.error?.error) {
        const errorData = error.error.error;

        switch (errorData.code) {
          case 'AUTH_LOCKED':
            throw new Error(
              `Conta bloqueada temporariamente. Tente novamente em ${errorData.retry_after_minutes} minutos.`,
            );
          case 'AUTH_INVALID':
            const attemptsMsg =
              errorData.attempts_remaining !== undefined
                ? ` (${errorData.attempts_remaining} tentativas restantes)`
                : '';
            throw new Error(`Credenciais inválidas${attemptsMsg}`);
          case 'VAL_001':
          case 'VAL_002':
          case 'VAL_003':
            throw new Error(errorData.message);
          default:
            throw new Error(errorData.message || 'Erro ao fazer login');
        }
      }

      throw error;
    }
  }

  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout no Supabase:', error);
    }

    localStorage.clear();

    this.router.navigate(['/']);
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  async atualizarSenha(novaSenha: string) {
    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) throw error;

    localStorage.removeItem('requires_password_change');

    this.router.navigate(['/home']);
  }

  requiresPasswordChange(): boolean {
    return localStorage.getItem('requires_password_change') === 'true';
  }

  getUserInfo() {
    return {
      id: localStorage.getItem('usuario_id'),
      email: localStorage.getItem('user_email'),
      name: localStorage.getItem('user_name'),
      avatar: localStorage.getItem('user_avatar'),
      role: localStorage.getItem('user_role'),
    };
  }

  hasRole(role: string): boolean {
    return localStorage.getItem('user_role') === role;
  }

  async isTokenValid(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        return false;
      }

      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        const expirationTime = expiresAt * 1000;
        const currentTime = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (expirationTime - currentTime < fiveMinutes) {
          await this.refreshToken();
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar validade do token:', error);
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data.session) {
        console.error('Erro ao renovar token:', error);
        await this.logout();
        return false;
      }

      localStorage.setItem('authToken', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);

      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await this.logout();
      return false;
    }
  }
}
