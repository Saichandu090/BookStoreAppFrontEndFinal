import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Constant } from '../constants/constant';

export const loginGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const localData = localStorage.getItem(Constant.LOGIN_TOKEN);
  if (localData != null) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
