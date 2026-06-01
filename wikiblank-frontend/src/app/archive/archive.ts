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

  // Riutilizziamo la tua ottima funzione per il tempo
  formatTime(ms: number): string {
    if (!ms) return "0m 0s";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }
  
  // Funzione extra per tradurre lo stato della partita in italiano
  translateStatus(status: string): string {
    if (status === 'WON') return 'Vittoria 🏆';
    if (status === 'SURRENDERED') return 'Resa 🏳️';
    return status;
  }
}