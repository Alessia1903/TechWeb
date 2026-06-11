import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'; 
import { FormatTimePipe } from '../shared/pipes/time-format-pipe';
import { TimeDiffPipe } from '../shared/pipes/diff-time-pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, FormatTimePipe, TimeDiffPipe], 
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
  activeGame: any = null; // eventuale partita in sospeso
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
    // evita race conditions
    if (this.isLoading) return;
    this.isLoading = true;

    this.restService.startGame().subscribe({
      next: (response: any) => { 
        this.isLoading = false; 

        // se l'utente ha già una partita in corso
        if (response.existingGameId) {
          this.router.navigate(['/play', response.existingGameId]);         
        } else if (response.gameId) {
          this.router.navigate(['/play', response.gameId]);
        }
      },
      error: () => {
        this.isLoading = false;
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
}