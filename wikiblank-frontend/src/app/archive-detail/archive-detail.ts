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

  // Riutilizziamo le funzioni di formattazione
  formatTime(ms: number): string {
    if (!ms) return "0m 0s";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  translateStatus(status: string): string {
    if (status === 'WON') return 'Vittoria 🏆';
    if (status === 'SURRENDERED') return 'Resa 🏳️';
    return status;
  }
}