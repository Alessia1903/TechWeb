import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { WikiFormatPipe } from '../shared/pipes/wiki-format-pipe';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, WikiFormatPipe],
  templateUrl: './play.html',
  styleUrl: './play.scss'
})
export class PlayComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private restService = inject(RestBackendService);
  private toastr = inject(ToastrService);

  gameId!: number;
  gameData: any = null;
  isLoading = true;

  guessForm = new FormGroup({
    word: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  ngOnInit() {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    if (idFromUrl) {
      this.gameId = +idFromUrl; // + lo trasforma da stringa a numero
      this.loadGame();
    } else {
      this.toastr.error("Partita non valida", "Errore");
      this.router.navigateByUrl('/home');
    }
  }

  // carica o aggiorna
  loadGame() {
    this.restService.getGameById(this.gameId).subscribe({
      next: (data) => {
        this.gameData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare la partita.", "Errore");
        this.router.navigateByUrl('/home');
      }
    });
  }

  handleGuess() {
    if (this.guessForm.invalid) return;
    const rawWord = this.guessForm.value.word as string;
    const guessedWord = rawWord.trim().split(' ')[0];
    this.restService.guessWord(this.gameId, guessedWord).subscribe({
      next: (response: any) => {
        this.guessForm.reset(); 
        
        if (response.victory) {
          this.triggerConfetti();
        }

        // in ogni caso ricarico la partita per vedere il testo aggiornato 
        this.loadGame(); 
      },
      error: (err) => {
        this.toastr.error("Errore durante l'invio del tentativo.", "Ops!");
      }
    });
  }

  handleSurrender() {
    if (confirm("Sei sicuro di volerti arrendere? Vedrai la soluzione ma perderai la partita.")) {
      this.restService.surrender(this.gameId).subscribe({
        next: (response: any) => { 
          this.gameData.status = response.status;
          this.gameData.fullText = response.fullText;
          this.gameData.correctTitle = response.correctTitle;
        },
        error: (err) => {
          this.toastr.error("Impossibile arrendersi, riprova.", "Errore");
        }
      });
    }
  }

  triggerConfetti() {
    confetti({
      particleCount: 500, 
      spread: 100,        
      origin: { y: 0.6 }, 
      colors: ['#7ed957', '#1abc9c', '#f1c40f', '#e74c3c', '#9b59b6'] 
    });
  }
}