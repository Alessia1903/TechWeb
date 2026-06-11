import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth/auth'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  
  isOpen = false; // Per il menu mobile
  
  authService = inject(AuthService);
  router = inject(Router);

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleNavigationClick(){
    this.isOpen = false;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/leaderboard';
    this.handleNavigationClick(); 
  }
}