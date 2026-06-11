import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),       //from local storage
    token: this.getToken(), 
    isAuthenticated: this.verifyToken(this.getToken()) 
  });

  // computed signal (read-only)
  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  // effect to keep localStorage aligned with this data
  constructor(){
    effect( () => {
      const token = this.authState().token;
      const user = this.authState().user;
      
      if(token !== null){
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      
      if(user !== null){
        localStorage.setItem("user", user);
      } else {
        localStorage.removeItem("user");
      }
    });
  }

  async updateToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user; 
    
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    });
  }

  getToken(){
    return localStorage.getItem("token");
  }

  getUser(){
    return localStorage.getItem("user");
  }

  verifyToken(token: string | null): boolean {
    if(token !== null){
      try{
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if(expiration === undefined || Date.now() >= expiration * 1000){
          return false; // Scaduto
        } else {
          return true; // Valido
        }
      } catch(error) { 
        return false; // Token non valido
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout(){
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
}