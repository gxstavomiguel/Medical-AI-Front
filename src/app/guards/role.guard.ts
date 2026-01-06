import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/user-role.interface';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as UserRole[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const userInfo = authService.getUserInfo();
  const currentRole = userInfo.role as UserRole | null;

  if (!currentRole) {
    console.error('❌ Usuário não possui role definida');
    router.navigate(['/home'], {
      queryParams: {
        error: 'no-role',
        message: 'Seu usuário não possui permissões definidas',
      },
    });
    return false;
  }

  const hasPermission = allowedRoles.includes(currentRole);

  if (!hasPermission) {
    console.warn('⚠️ Acesso negado: usuário não tem permissão para esta rota');
    console.warn(`  Role necessária: ${allowedRoles.join(' ou ')}`);
    console.warn(`  Role do usuário: ${currentRole}`);

    router.navigate(['/home'], {
      queryParams: {
        error: 'access-denied',
        message: 'Você não tem permissão para acessar esta página',
      },
    });

    return false;
  }

  return true;
};
