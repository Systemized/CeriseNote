import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = await authService.checkValidSession();
  if (loggedIn) {
    return true;
  } else {
    return router.navigate(['/login']);
  }

};

export const dashRedirect: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = await authService.checkValidSession();
  if (loggedIn) {
    return router.navigate(['/dashboard']);
  } else {
    return true;
  }
};
