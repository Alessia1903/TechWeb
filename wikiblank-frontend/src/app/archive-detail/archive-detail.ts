import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { WikiFormatPipe } from '../shared/pipes/wiki-format-pipe';
import { FormatTimePipe } from '../shared/pipes/time-format-pipe';

@Component({
  selector: 'app-archive-detail',
  standalone: true,
  imports: [RouterLink, WikiFormatPipe, FormatTimePipe], 
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
      error: () => {
        this.toastr.error("Impossibile caricare i dettagli della partita.", "Errore");
        this.isLoading = false;
      }
    });
  }
}