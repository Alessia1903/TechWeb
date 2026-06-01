import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestBackendService } from '../services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { WikiFormatPipe } from '../shared/pipes/wiki-format-pipe';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, WikiFormatPipe],
  templateUrl: './play.html',
  styleUrl: './play.scss'
})
export class PlayComponent implements OnInit {
  // Iniezione delle dipendenze
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private restService = inject(RestBackendService);
  private toastr = inject(ToastrService);

  gameId!: number;
  gameData: any = null; // Qui salveremo la risposta del backend
  isLoading = true;

  // Form per inviare la parola da indovinare
  guessForm = new FormGroup({
    word: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  ngOnInit() {
    // 1. Catturiamo l'ID dall'URL (es. /play/12 -> id = 12)
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    if (idFromUrl) {
      this.gameId = +idFromUrl; // Il '+' lo trasforma da stringa a numero
      this.loadGame();
    } else {
      this.toastr.error("Partita non valida", "Errore");
      this.router.navigateByUrl('/games');
    }
  }

  // Carica (o aggiorna) i dati della partita attuale
  loadGame() {
    this.restService.getGameById(this.gameId).subscribe({
      next: (data) => {
        this.gameData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error("Impossibile caricare la partita.", "Errore");
        this.router.navigateByUrl('/games');
      }
    });
  }

  // Gestisce l'invio di una parola
  handleGuess() {
    if (this.guessForm.invalid) return;

    const guessedWord = this.guessForm.value.word as string;

    // Chiamiamo l'API del backend per verificare la parola
    this.restService.guessWord(this.gameId, guessedWord).subscribe({
      next: (response: any) => {
        // Se la parola era presente nel testo, il backend ci avviserà (adatta in base alla tua risposta JSON)
        this.toastr.success(`Tentativo registrato per: "${guessedWord}"`, "Parola Inviata");
        
        this.guessForm.reset(); // Svuota la casella di testo
        this.loadGame(); // Ricarichiamo la partita per vedere il testo aggiornato con le nuove parole scoperti!
      },
      error: (err) => {
        this.toastr.error("Errore durante l'invio del tentativo.", "Ops!");
      }
    });
  }

  // Gestisce il pulsante per arrendersi
  handleSurrender() {
  if (confirm("Sei sicuro di volerti arrendere? Vedrai tutto il testo in chiaro ma perderai la partita.")) {
    this.restService.surrender(this.gameId).subscribe({
      next: (response: any) => { 
        this.toastr.warning("Ti sei arreso! Ecco il testo completo.", "Partita Terminata");
        
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
}