import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// Questi sono i "postini" che creeremo tra poco!
import { AuthService } from '../services/auth/auth';
import { RestBackendService } from '../services/rest-backend/rest-backend';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  
  submitted = false;
  
  loginForm = new FormGroup({
    usr: new FormControl('', [Validators.required]),
    pwd: new FormControl('', [
      Validators.required, 
      Validators.minLength(5), 
      Validators.maxLength(20)
    ])
  });
  
  handleLogin() {
    this.submitted = true;
    
    if(this.loginForm.invalid) {
      alert("Attenzione: Inserisci username e password validi!");
      return;
    } 

    this.restService.login({
      usr: this.loginForm.value.usr as string,
      pwd: this.loginForm.value.pwd as string,
    }).subscribe({
      next: (response: any) => {
        // Salviamo il Token JWT estratto dal JSON del tuo backend
        this.authService.updateToken(response.token); 
        this.toastr.success(`Benvenuto ${this.loginForm.value.usr}!`, 'Accesso Eseguito');
        setTimeout(() => {
          this.router.navigateByUrl("/games"); 
        }, 50);
      },
      error: (err) => {
        this.toastr.error("Credenziali non valide! Riprova.", "Ops! Errore di Accesso");
      }
    });
  }
}