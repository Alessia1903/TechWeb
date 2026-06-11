import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import { RestBackendService } from '../services/rest-backend/rest-backend'; 
import { ToastrService } from 'ngx-toastr';
import { FormatTimePipe } from '../shared/pipes/time-format-pipe';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [RouterLink, DatePipe, FormatTimePipe], 
  templateUrl: './archive.html',
  styleUrl: './archive.scss'
})
export class ArchiveComponent implements OnInit {

  restService = inject(RestBackendService);
  toastr = inject(ToastrService);

  //variabili paginazione
  currentPage: number = 1;
  itemsPerPage: number = 10;

  archivedGames: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchArchive();
  }

  fetchArchive() {
    this.restService.getArchivedGames().subscribe({
      next: (data) => {
        this.archivedGames = data;
        this.isLoading = false; 
      },
      error: () => {
        this.toastr.error("Impossibile caricare l'archivio delle partite.", "Errore server");
        this.isLoading = false;
      }
    });
  }

  // LOGICA PAGINAZIONE
  get totalPages(): number {
    return Math.ceil(this.archivedGames.length / this.itemsPerPage) || 1; 
  }
  
  get paginatedGames() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.archivedGames.slice(startIndex, startIndex + this.itemsPerPage);
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