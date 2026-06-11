import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink], 
  template: `
    <div class="not-found-container">
      <img src="/assets/404.png" alt="Immagine 404" class="assets-image">
      <h2>Ops! Pagina non trovata.</h2>
      <p>Non c'è proprio niente da vedere qui.</p>
      
      <button routerLink="/leaderboard" class="btn-back">Torna a giocare</button>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      padding: 80px 20px;
    }

    .assets-image {
      display: block;
      max-width: 80%; 
      height: auto;
      margin: 0 auto 15px; 
    }
    
    h2 {
      color: #2c3e50;
      font-size: 2rem;
      margin-top: 15px;
    }
    
    p {
      color: #7f8c8d;
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
    
    .btn-back {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 1.1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease-in-out;
    }
    
    .btn-back:hover {
      background-color: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(52, 152, 219, 0.35);
    }
  `]
})
export class NotFoundComponent {
}