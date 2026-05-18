import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api-service';

@Component({
  selector: 'app-inscriptions',
  standalone: false,
  templateUrl: './inscriptions.html',
  styleUrl: './inscriptions.css',
})
export class Inscriptions implements OnInit {
  inscriptions: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getInscriptions().subscribe({
      next: (data) => { this.inscriptions = data; },
      error: (err) => console.error('Erreur chargement inscriptions:', err)
    });
  }

  remove(id: string) {
    const [candidatId, sessionId] = id.split('-').map(Number);
    if (confirm('Supprimer cette inscription ?')) {
      this.api.annulerInscription(candidatId, sessionId).subscribe(() => this.load());
    }
  }
}
