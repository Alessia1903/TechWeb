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
  
  serverErrorMessage: string | null = null;
  
  signupForm = new FormGroup({
    usr: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    pwd: new FormControl('', [
      Validators.required, 
      Validators.minLength(5), 
      Validators.maxLength(20)
    ])
  });
  
  handleSignup() {
    
    if(this.signupForm.invalid){
      this.serverErrorMessage = "I dati che hai inserito non sono validi. Controlla i campi evidenziati.";
      return;
    } 

    this.restService.signup({
      usr: this.signupForm.value.usr as string,
      pwd: this.signupForm.value.pwd as string,
    }).subscribe({
      error: (err) => {
        this.serverErrorMessage = "Questo username è già stato preso. Scegline un altro!";
      },
      complete: () => {
        this.serverErrorMessage = null;
        this.toastr.success(`Ora puoi accedere con il tuo account`, `Benvenuto ${this.signupForm.value.usr}!`);
        this.router.navigateByUrl("/login");
      }
    });
  }

  ngOnInit() {
    this.signupForm.valueChanges.subscribe(() => {
      this.serverErrorMessage = null;
    });
  }
}