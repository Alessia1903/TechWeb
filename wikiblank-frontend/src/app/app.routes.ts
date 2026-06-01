import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { HomepageComponent } from './homepage/homepage'; // <-- Importa la homepage
import { ArchiveComponent } from './archive/archive';
import { ArchiveDetailComponent } from './archive-detail/archive-detail';
import { GamesComponent } from './games/games';
import { PlayComponent } from './play/play';
import { authGuard } from './guards/auth.guard'; // <-- Importa il buttafuori

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'homepage', component: HomepageComponent},
  { path: 'archive', component: ArchiveComponent },
  { path: 'archive/:id', component: ArchiveDetailComponent },
  { 
    path: '', 
    redirectTo: '/homepage', 
    pathMatch: 'full' 
  },
  { 
    path: 'games', 
    component: GamesComponent,
    canActivate: [authGuard] // Proteggiamo la pagina!
  },
  { 
    path: 'play/:id', 
    component: PlayComponent,
    canActivate: [authGuard] // Proteggiamo la pagina!
  }
];