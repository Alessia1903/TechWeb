import { Component, OnInit, inject } from '@angular/core';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { FormatTimePipe } from '../shared/pipes/time-format-pipe';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink, FormatTimePipe],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss'
})
export class LeaderboardComponent implements OnInit {

  restService = inject(RestBackendService);
  toastr = inject(ToastrService);

  leaderboard: any[] = [];
  currentUserFallback: any = null;
  isLoading = true; 
  currentUsername: string = '';

  ngOnInit() {
    this.currentUsername = localStorage.getItem('user') || '';
    this.fetchLeaderboard();
  }

  fetchLeaderboard() {
    this.restService.getLeaderboard().subscribe({
      next: (data: any) => {
        this.leaderboard = data.top10; 
        this.currentUserFallback = data.currentUserFallback;
        
        this.isLoading = false; 
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare la classifica. Riprova più tardi.", "Errore di Rete");
        this.isLoading = false;
      }
    });
  }
}