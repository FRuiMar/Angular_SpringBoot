import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

// Este guard permitirá el acceso solo a los usuarios autenticados.
export const AuthGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  const user = apiService.getUserFromLocalStorage();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
