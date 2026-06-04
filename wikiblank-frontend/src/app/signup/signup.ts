import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../services/rest-backend/rest-backend'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  
  submitted = false;
  
  // Usiamo userName e password come fatto nel Login!
  signupForm = new FormGroup({
    usr: new FormControl('', [Validators.required]),
    pwd: new FormControl('', [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(16)
    ])
  });
  
  handleSignup() {
    this.submitted = true;
    
    if(this.signupForm.invalid){
      this.toastr.error("I dati che hai inserito non sono validi!", "Ops! Controlla i campi");
      return;
    } 

    this.restService.signup({
      usr: this.signupForm.value.usr as string,
      pwd: this.signupForm.value.pwd as string,
    }).subscribe({
      error: (err) => {
        this.toastr.error("Questo username è già stato preso. Scegline un altro!", "Registrazione fallita");
      },
      complete: () => {
        this.toastr.success(`Ora puoi accedere con il tuo account`, `Benvenuto ${this.signupForm.value.usr}!`);
        this.router.navigateByUrl("/login");
      }
    });
  }
}