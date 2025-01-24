import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_CONSTANTS } from '../constants/constant';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localData = localStorage.getItem(APP_CONSTANTS.LOGIN_TOKEN);
  if (localData != null) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
