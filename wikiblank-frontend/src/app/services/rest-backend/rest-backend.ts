import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {
  
  private url = "http://localhost:3000";
  private http = inject(HttpClient);

  //header di ogni spedizione per specificare formato (json)
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // ==========================================
  // ROTTE DI AUTENTICAZIONE
  // ==========================================

  login(loginRequest: any) {
    const url = `${this.url}/auth`; 
    return this.http.post<any>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: any) {
    const url = `${this.url}/signup`; 
    return this.http.post<any>(url, signupRequest, this.httpOptions);
  }

  // ==========================================
  // ROTTE PUBBLICHE (Non serve il Token)
  // ==========================================

  getLeaderboard() {
    const url = `${this.url}/leaderboard`;
    return this.http.get<any[]>(url, this.httpOptions);
  }

  getArchivedGames() {
    const url = `${this.url}/archive`;
    return this.http.get<any[]>(url, this.httpOptions);
  }
  
  getArchivedGame(id: number) {
    const url = `${this.url}/archive/${id}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  // ==========================================
  // ROTTE PRIVATE DI GIOCO (Serve il Token)
  // ==========================================

  getGames() {
    const url = `${this.url}/games`;
    return this.http.get<any[]>(url, this.httpOptions);
  }

  getGameById(id: number) {
    const url = `${this.url}/games/${id}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  startGame() {
    const url = `${this.url}/games/start`;
    return this.http.post<any>(url, {}, this.httpOptions);
  }

  guessWord(gameId: number, word: string) {
    const url = `${this.url}/games/${gameId}/guess`;
    return this.http.post<any>(url, { word: word }, this.httpOptions);
  }

  surrender(gameId: number) {
    const url = `${this.url}/games/${gameId}/surrender`;
    return this.http.post<any>(url, {}, this.httpOptions);
  }
}