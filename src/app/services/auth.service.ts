import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../core/supabase.client';
import { environment } from '../environments/environment.supabase';
import { LoginResponse } from '../interfaces/login-response.interface';
import { UserProfile, UserRole } from '../interfaces/user-role.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userIdSignal = signal<string | null>(null);
  private profileSignal = signal<UserProfile | null>(null);
  private loadingSignal = signal<boolean>(false);

  userId = this.userIdSignal.asReadonly();
  profile = this.profileSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  isAuthenticated = computed(() => !!this.userIdSignal());
  userRole = computed(() => this.profileSignal()?.role || null);
  isStudent = computed(() => this.userRole() === 'student');
  isAdmin = computed(() => this.userRole() === 'admin');

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      this.loadingSignal.set(true);

      const userId = localStorage.getItem('usuario_id');
      const isLoggedIn = await this.isLoggedIn();

      if (userId && isLoggedIn) {
        this.userIdSignal.set(userId);
        await this.loadUserProfile(userId);
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return;
      }

      this.profileSignal.set(data as UserProfile);

      if (data.role) {
        localStorage.setItem('user_role', data.role);
      }
      if (data.name) {
        localStorage.setItem('user_name', data.name);
      }
      if (data.avatar_url) {
        localStorage.setItem('user_avatar', data.avatar_url);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    }
  }

  async login(login: string, password: string) {
    try {
      const response = await this.http
        .post<LoginResponse>(`${environment.n8nUrl}/login`, {
          identifier: login,
          password,
        })
        .toPromise();

      if (!response || !response.success) {
        throw new Error(response?.error?.message || 'Login failed');
      }

      const respAny = response as any;
      const userObj = response.user ?? respAny.user ?? null;
      const session = respAny.session ?? null;
      const accessToken = respAny.access_token ?? session?.access_token ?? null;
      const refreshToken = respAny.refresh_token ?? session?.refresh_token ?? null;
      const requiresPasswordChange =
        response.requires_password_change ?? respAny.action_required === 'change_password';

      if (userObj?.id) {
        localStorage.setItem('usuario_id', userObj.id);
        this.userIdSignal.set(userObj.id);
      }

      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
      }

      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      if (userObj?.email) {
        localStorage.setItem('user_email', userObj.email);
      }

      if (userObj?.role) {
        localStorage.setItem('user_role', userObj.role);
      }

      localStorage.setItem('requires_password_change', String(requiresPasswordChange));

      if (userObj?.name) {
        localStorage.setItem('user_name', userObj.name);
      }

      if (userObj?.avatar_url) {
        localStorage.setItem('user_avatar', userObj.avatar_url);
      }

      if (accessToken && refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;
        } catch (e: any) {
          console.warn('Supabase setSession warning:', e?.message || e);

          if (e?.message && !e.message.includes('Auth session missing')) {
            throw e;
          }
        }
      } else {
        console.warn(
          'Login response missing access_token/refresh_token; skipping supabase session setup.',
        );
      }

      if (userObj?.id) {
        await this.loadUserProfile(userObj.id);
      }

      if (requiresPasswordChange) {
        this.router.navigate(['/nova-senha']);
      } else {
        this.router.navigate(['/home']);
      }

      return response;
    } catch (error: any) {
      this.userIdSignal.set(null);
      this.profileSignal.set(null);

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

    this.userIdSignal.set(null);
    this.profileSignal.set(null);

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
    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (authError) {
        console.error('❌ Erro no Supabase Auth:', authError);

        if (
          authError.message?.toLowerCase().includes('same') ||
          authError.message?.toLowerCase().includes('different')
        ) {
          console.warn('⚠️ Senha igual à anterior, continuando...');
        } else {
          throw new Error('Erro ao atualizar senha: ' + authError.message);
        }
      } else {
      }

      const userId = localStorage.getItem('usuario_id');
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }

      try {
        const token = await this.getToken();
        if (token) {
          const response = await Promise.race([
            this.http
              .post<any>(
                `${environment.n8nUrl}/change-password`,
                { new_password: novaSenha },
                { headers: { Authorization: `Bearer ${token}` } },
              )
              .toPromise(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
          ]);

          if (response?.success === true) {
            localStorage.removeItem('requires_password_change');

            await this.refreshProfile();

            this.router.navigate(['/home']);
            return;
          }
        }
      } catch (backendError: any) {
        console.warn('⚠️ Backend não respondeu:', backendError.message);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ requires_password_change: false })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Erro ao atualizar profile:', updateError);
        throw new Error('Erro ao atualizar profile: ' + updateError.message);
      }

      const { data: profileData, error: checkError } = await supabase
        .from('profiles')
        .select('requires_password_change')
        .eq('id', userId)
        .single();

      if (checkError) {
        console.error('❌ Erro ao verificar profile:', checkError);
        throw new Error('Erro ao verificar atualização');
      }

      if (profileData?.requires_password_change === false) {
        localStorage.removeItem('requires_password_change');

        await this.refreshProfile();

        this.router.navigate(['/home']);
      } else {
        throw new Error('Falha ao atualizar requires_password_change');
      }
    } catch (e: any) {
      console.error('❌ Erro geral:', e);
      throw e;
    }
  }

  requiresPasswordChange(): boolean {
    const localStorageCheck = localStorage.getItem('requires_password_change') === 'true';
    const profileCheck = this.profileSignal()?.requires_password_change === true;

    return localStorageCheck || profileCheck;
  }

  getUserInfo() {
    const profile = this.profileSignal();

    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar_url,
        role: profile.role,
        student_code: profile.student_code,
      };
    }

    return {
      id: localStorage.getItem('usuario_id'),
      email: localStorage.getItem('user_email'),
      name: localStorage.getItem('user_name'),
      avatar: localStorage.getItem('user_avatar'),
      role: localStorage.getItem('user_role'),
      student_code: null,
    };
  }

  hasRole(roles: UserRole[] | UserRole): boolean {
    const currentRole = this.userRole();

    if (!currentRole) {
      return false;
    }

    if (Array.isArray(roles)) {
      return roles.includes(currentRole);
    }

    return currentRole === roles;
  }

  hasRoleOld(role: string): boolean {
    const currentRole = this.userRole();
    if (currentRole) {
      return currentRole === role;
    }

    return localStorage.getItem('user_role') === role;
  }

  async refreshProfile(): Promise<void> {
    const userId = this.userIdSignal();
    if (userId) {
      await this.loadUserProfile(userId);
    }
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
