import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar'; // <-- NUOVO

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent], // <-- AGGIUNGILO QUI
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'wikiblank-frontend';
}