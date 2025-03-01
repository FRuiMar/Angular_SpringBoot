import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

// Este guard permitirá el acceso solo a los usuarios autenticados (admin).
export const AdminGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  const user = apiService.getUserFromLocalStorage();
  if (!user || user.rol !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  return true;
};
