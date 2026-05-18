import { Component, OnInit } from '@angular/core';
import { Candidat } from '../../../../interfaces/candidat';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../core/services/api-service';

@Component({
  selector: 'app-inscription',
  standalone: false,
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription implements OnInit {
  candidat: Candidat = { nom: '', prenom: '', email: '' };
  sessionID!: number;
  erreur: string | null = null;
  isLoading = false;
  success = false;

  constructor(private route: ActivatedRoute, protected router: Router, public service: ApiService) {}

  ngOnInit(): void {
    this.sessionID = Number(this.route.snapshot.paramMap.get('sessionID'));
  }

  onSumbit() {
    if (!this.candidat.nom || !this.candidat.prenom || !this.candidat.email) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }
    this.erreur = null;
    this.isLoading = true;

    this.service.inscrire(this.sessionID, this.candidat).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.erreur = err.error?.error || 'Erreur lors de l\'inscription';
      }
    });
  }
}
