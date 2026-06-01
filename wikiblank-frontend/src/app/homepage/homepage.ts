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
  isLoading = true; // Ci serve per mostrare un "Caricamento..." finché i dati non arrivano

  // ngOnInit scatta in automatico appena la pagina si apre
  ngOnInit() {
    this.fetchLeaderboard();
  }

  fetchLeaderboard() {
    this.restService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.isLoading = false; // Caricamento finito!
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare la classifica. Riprova più tardi.", "Errore di Rete");
        this.isLoading = false;
      }
    });
  }

  // Funzione per trasformare i millisecondi in "Xm Ys" (es. "2m 15s")
  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }
}