import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService); 
  
  if (authService.isUserAuthenticated()) {
    return true;
  } else {
    toastr.warning("Devi fare il login per accedere a questa pagina", "Accesso Negato!"); 
    return router.parseUrl("/login"); 
  }
};