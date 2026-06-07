import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'; // Utile per formattare le date in modo carino

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe], // Importiamo il "tubo" per le date
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class GamesComponent implements OnInit {
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);

  //variabili paginazione
  currentPage: number = 1;
  itemsPerPage: number = 10;

  games: any[] = [];
  activeGame: any = null; // Qui salveremo l'eventuale partita in sospeso
  isLoading = true;

  ngOnInit() {
    this.fetchMyGames();
  }

  fetchMyGames() {
    this.restService.getGames().subscribe({
      next: (data) => {
        this.games = data.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        // Cerchiamo se c'è una partita ancora in corso
        this.activeGame = this.games.find(g => g.status === 'IN_PROGRESS');
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare le tue partite.", "Errore");
        this.isLoading = false;
      }
    });
  }

  startNewGame() {
    this.restService.startGame().subscribe({
      next: (newGame) => {
        this.router.navigate(['/play', newGame.gameId]); 
      },
      error: (err) => {
        this.toastr.error("Non è stato possibile avviare una nuova partita.", "Errore server");
      }
    });
  }

  resumeGame(gameId: number) {
    this.toastr.info("Bentornato! Riprendiamo da dove avevi lasciato.", "Partita Ripresa");
    this.router.navigate(['/play', gameId]);
  }

  // LOGICA PAGINAZIONE
  get totalPages(): number {
    return Math.ceil(this.games.length / this.itemsPerPage) || 1; 
  }
  // Restituisce l'array tagliato per la pagina corrente (è quello che usa l'HTML nel @for)
  get paginatedGames() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.games.slice(startIndex, startIndex + this.itemsPerPage);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // calcolo del tempo
  formatDuration(startTime: string | Date, endTime: string | Date | null | undefined): string {
    if (!endTime) return 'In corso...';

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    // 1. CONTROLLO ERRORI: Se una delle due date non è valida (NaN), esci in modo pulito
    if (isNaN(start) || isNaN(end)) return '---';

    const diffMs = end - start;

    if (diffMs < 0) return '---';

    // 2. CALCOLO CON LE ORE INCLUSE
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    // 3. COSTRUZIONE STRINGA DINAMICA (più pulita)
    let timeString = '';
    
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) { // Mostra i minuti se ci sono ore, anche se sono 0 (es. 1h 0m)
      timeString += `${minutes}m `;
    }
    
    timeString += `${seconds}s`;

    return timeString.trim();
  }
}