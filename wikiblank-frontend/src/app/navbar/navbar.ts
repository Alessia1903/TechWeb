import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth/auth'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-navbar',
  standalone: true,
  // Importiamo RouterLink (per i link) e RouterLinkActive (per evidenziare in che pagina siamo)
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  
  isOpen = false; // Per il menu mobile
  
  // Iniettiamo i servizi
  authService = inject(AuthService);
  router = inject(Router);

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleNavigationClick(){
    this.isOpen = false;
  }

  // Aggiungiamo un metodo comodissimo per disconnettersi
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.handleNavigationClick(); // Chiudiamo il menu mobile se era aperto
  }
}