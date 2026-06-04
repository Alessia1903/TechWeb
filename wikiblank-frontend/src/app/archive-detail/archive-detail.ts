import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { WikiFormatPipe } from '../shared/pipes/wiki-format-pipe';

@Component({
  selector: 'app-archive-detail',
  standalone: true,
  imports: [RouterLink, WikiFormatPipe], // Ci serve per il bottone "Indietro" e per la formattazione del testo
  templateUrl: './archive-detail.html',
  styleUrl: './archive-detail.scss'
})
export class ArchiveDetailComponent implements OnInit {
  
  route = inject(ActivatedRoute);
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);

  gameDetails: any = null;
  isLoading = true;

  ngOnInit() {
    // Leggiamo l'ID dall'URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.fetchGameDetails(Number(idParam));
    }
  }

  fetchGameDetails(id: number) {
    this.restService.getArchivedGame(id).subscribe({
      next: (data) => {
        this.gameDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare i dettagli della partita.", "Errore");
        this.isLoading = false;
      }
    });
  }

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

  translateStatus(status: string): string {
    if (status === 'WON') return 'Vittoria!';
    if (status === 'SURRENDERED') return 'Resa';
    return status;
  }
}