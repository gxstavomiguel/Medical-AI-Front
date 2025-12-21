import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { supabase } from '../core/supabase.client';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const publicUrls = ['/login'];
  const isPublicUrl = publicUrls.some((url) => req.url.includes(url));

  if (isPublicUrl) {
    return next(req);
  }

  return from(supabase.auth.getSession()).pipe(
    switchMap(({ data }) => {
      const token = data.session?.access_token;

      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next(req);
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.clear();
        supabase.auth.signOut();
        router.navigate(['/']);
      }
      return throwError(() => error);
    }),
  );
};
