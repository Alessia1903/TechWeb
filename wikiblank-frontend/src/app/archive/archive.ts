import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common'; // Molto utile per formattare le date nell'HTML
import { RestBackendService } from '../services/rest-backend/rest-backend'; // Controlla che il percorso sia giusto!
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-archive',
  standalone: true,
  // Importiamo RouterLink per i bottoni e DatePipe per mostrare belle date (es. 12/05/2024)
  imports: [RouterLink, DatePipe], 
  templateUrl: './archive.html',
  styleUrl: './archive.scss'
})
export class ArchiveComponent implements OnInit {

  // Iniezione dei servizi
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);

  // Variabili di stato
  archivedGames: any[] = [];
  isLoading = true;

  // ngOnInit scatta in automatico quando si apre la pagina
  ngOnInit() {
    this.fetchArchive();
  }

  fetchArchive() {
    // Chiamiamo il metodo pubblico che hai aggiunto prima nel servizio
    this.restService.getArchivedGames().subscribe({
      next: (data) => {
        this.archivedGames = data;
        this.isLoading = false; // Spegniamo il caricamento
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare l'archivio delle partite.", "Errore server");
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
    if (status === 'WON') return 'Vittoria';
    if (status === 'SURRENDERED') return 'Resa';
    return status;
  }
}