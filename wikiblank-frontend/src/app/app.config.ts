import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    provideAnimationsAsync(), 
    
    provideToastr({
      progressBar: true,
      newestOnTop: true,
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    
    // Il motore di rete con Fetch e Interceptor
    provideHttpClient(
      withFetch(), 
      withInterceptors([authInterceptor])
    ),
    
    provideRouter(routes)
  ]
};