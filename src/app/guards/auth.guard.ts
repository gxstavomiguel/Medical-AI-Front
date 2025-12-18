import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { supabase } from '../core/supabase.client';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    router.navigate(['/']);
    return false;
  }
};

export const publicGuard: CanActivateFn = async () => {
  const router = inject(Router);
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      return true;
    } else {
      router.navigate(['/home']);
      return false;
    }
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return true;
  }
};

