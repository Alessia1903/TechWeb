import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // <-- Import

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService); // <-- Iniezione
  
  if (authService.isUserAuthenticated()) {
    return true;
  } else {
    toastr.warning("Devi fare il login per accedere a questa pagina", "Accesso Negato!"); // <-- Il nuovo Toast!
    return router.parseUrl("/login"); 
  }
};