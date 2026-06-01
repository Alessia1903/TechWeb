import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// 1. IL FIX È QUI: Importiamo la versione 'Async' delle animazioni
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// Assicurati che il percorso dell'interceptor sia corretto in base alla tua cartella!
import { authInterceptor } from './interceptors/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // 2. IL FIX È QUI: Usiamo il nuovo metodo
    provideAnimationsAsync(), 
    
    // La bellissima configurazione dei Toast del tuo prof
    provideToastr({
      progressBar: true,
      newestOnTop: true,
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    
    // Il motore di rete con Fetch e il nostro "casellante" (Interceptor)
    provideHttpClient(
      withFetch(), 
      withInterceptors([authInterceptor])
    ),
    
    provideRouter(routes)
  ]
};