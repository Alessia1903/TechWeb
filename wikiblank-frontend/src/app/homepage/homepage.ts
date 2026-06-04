import { Component, OnInit, inject } from '@angular/core';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class HomepageComponent implements OnInit {
  // Iniezione dei servizi
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);

  // Variabili per gestire i dati e lo stato della pagina
  leaderboard: any[] = [];
  currentUserFallback: any = null;
  isLoading = true; // Ci serve per mostrare un "Caricamento..." finché i dati non arrivano

  // ngOnInit scatta in automatico appena la pagina si apre
  ngOnInit() {
    this.fetchLeaderboard();
  }

  fetchLeaderboard() {
    this.restService.getLeaderboard().subscribe({
      next: (data: any) => {
        console.log("Dati grezzi dal backend:", data);
        this.leaderboard = data.top10; // Assegniamo solo l'array dei primi 10
        this.currentUserFallback = data.currentUserFallback; // Salviamo il ripescaggio
        
        this.isLoading = false; // Caricamento finito!
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare la classifica. Riprova più tardi.", "Errore di Rete");
        this.isLoading = false;
      }
    });
  }

  // Nuova versione: prende i millisecondi (ms) e usa la logica avanzata
  formatTime(ms: number | null | undefined): string {
    // 1. Controllo base: se non c'è un tempo valido o è negativo
    if (ms === null || ms === undefined || isNaN(ms) || ms < 0) {
      return '---';
    }

    // 2. CALCOLO CON LE ORE INCLUSE
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    // 3. COSTRUZIONE STRINGA DINAMICA
    let timeString = '';
    
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) { // Mostra i minuti se ci sono ore, anche se sono 0 (es. 1h 0m)
      timeString += `${minutes}m `;
    }
    
    timeString += `${seconds}s`;

    return timeString.trim() || '0s'; // Aggiunto un fallback se il tempo è esattamente 0 millisecondi
  }
}