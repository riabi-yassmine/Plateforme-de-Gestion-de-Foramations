import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api-service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../guards/auth-guard';

@Component({
  selector: 'app-admin-login',
  standalone:true,
  imports: [FormsModule],           
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  credentials={email:'',password:''};
  erreur:string|null=null;
  isLoading=false;
  constructor(private api:ApiService,
    private router:Router,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ){}
  /*async onLogin(){
    this.erreur=null;
    this.isLoading=true;
    try{
      const reponse=await this.api.loginAdmin(this.credentials).toPromise();
      if(reponse.success){
        localStorage.setItem('isAdminLoggedIn','true');
        this.router.navigate(['/admin/dashboard']);
      }
    }catch(err:any){
      
      console.error('erreur de connexion',err);
      this.credentials.password='';
      //this.erreur='Email ou mot de passe incorrecte';
       if (err.status === 401) {
        this.erreur = 'Email ou mot de passe incorrect';
      } else if (err.status === 400) {
        this.erreur = 'Veuillez remplir tous les champs';
      } else {
        this.erreur = 'Erreur de connexion au serveur';
      }
      setTimeout(() => {
        // Ce timeout aide parfois avec la détection de changement
      }, 0);
    } finally {
      this.isLoading = false;
    }
  }*/
  async onLogin() {
  this.erreur = null;
  this.isLoading = true;
  this.cdr.detectChanges();

  this.api.loginAdmin(this.credentials)
   .pipe(finalize(() => {
    this.isLoading = false;
    this.cdr.detectChanges();
  }))
  
  .subscribe({
    next: (reponse) => {
      if (reponse.success) {
        console.log('Connexion réussie',reponse);
        this.auth.login();
        this.router.navigate(['/admin/dashboard']);
       
       
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.log('erreur login',err);
      console.error('Erreur de connexion', err);
      this.credentials.password = '';

      if (err.status === 401) {
        this.erreur = 'Email ou mot de passe incorrect';
      } else if (err.status === 400) {
        this.erreur = 'Veuillez remplir tous les champs';
      } else {
        this.erreur = 'Erreur de connexion au serveur';
      }

      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}



onInputChange() {
    if (this.erreur) {
      this.erreur = null;
    }
  }
}





  



