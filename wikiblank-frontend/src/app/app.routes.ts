import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { LeaderboardComponent } from './leaderboard/leaderboard'; 
import { ArchiveComponent } from './archive/archive';
import { ArchiveDetailComponent } from './archive-detail/archive-detail';
import { GamesComponent } from './home/home';
import { PlayComponent } from './play/play';
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'leaderboard', component: LeaderboardComponent},
  { path: 'archive', component: ArchiveComponent },
  { path: 'archive/:id', component: ArchiveDetailComponent },
  { 
    path: '', 
    redirectTo: '/leaderboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    component: GamesComponent,
    canActivate: [authGuard] // Proteggiamo la pagina!
  },
  { 
    path: 'play/:id', 
    component: PlayComponent,
    canActivate: [authGuard] // Proteggiamo la pagina!
  }
];