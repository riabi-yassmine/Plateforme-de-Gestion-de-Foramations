// auth.service.ts
import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login() {
    localStorage.setItem('isAdminLoggedIn', 'true');
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  }
}

// auth-guard.ts
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
