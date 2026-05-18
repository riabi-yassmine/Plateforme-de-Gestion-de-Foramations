import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/services/api-service';

@Component({
  selector: 'app-mes-inscriptions',
  imports: [ReactiveFormsModule],
  templateUrl: './mes-inscriptions.html',
  styleUrl: './mes-inscriptions.css'
})
export class MesInscriptionsComponent {
  form: FormGroup;
  inscriptions: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  rechercher() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = null;
    this.inscriptions = [];

    const nom = String(this.form.value.nom ?? '').trim();
    const prenom = String(this.form.value.prenom ?? '').trim();
    const email = String(this.form.value.email ?? '').trim().toLowerCase();

    this.api.getMesInscriptions({ nom, prenom, email }).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.inscriptions = Array.isArray(data) ? data : [];
        if (this.inscriptions.length === 0) {
          this.error = 'Aucune inscription trouvée avec ces informations.';
        }
      },
      error: () => {
        this.error = 'Aucune inscription trouvée avec ces informations.';
        this.inscriptions = [];
      }
    });
  }

  annuler(inscription: any) {
    if (confirm('Voulez-vous vraiment annuler cette inscription ?')) {
      this.api.annulerInscription(inscription.candidatId, inscription.sessionId).subscribe({
        next: () => {
          this.inscriptions = this.inscriptions.filter(i =>
            !(i.candidatId === inscription.candidatId && i.sessionId === inscription.sessionId)
          );
          this.cdr.detectChanges();
        },
        error: () => {
          alert('Erreur lors de l\'annulation.');
        }
      });
    }
  }
}
