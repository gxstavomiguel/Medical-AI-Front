import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { supabase } from '../core/supabase.client';

export const changePasswordGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.navigate(['/']);
      return false;
    }

    const requiresChange = localStorage.getItem('requires_password_change') === 'true';

    if (!requiresChange) {
      router.navigate(['/home']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    router.navigate(['/']);
    return false;
  }
};
