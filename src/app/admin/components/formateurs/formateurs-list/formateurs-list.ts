import { Component, OnInit } from '@angular/core';
import { Formateur } from '../../../../public/interfaces/formateur';
import { ApiService } from '../../../../core/services/api-service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-formateurs-list',
  standalone: false,
  templateUrl: './formateurs-list.html',
  styleUrl: './formateurs-list.css',
})
export class FormateursList implements OnInit {
  private all$ = new BehaviorSubject<Formateur[]>([]);
  private search$ = new BehaviorSubject<string>('');

  formateur$ = combineLatest([this.all$, this.search$]).pipe(
    map(([formateurs, term]) => {
      const t = term.toLowerCase().trim();
      return t ? formateurs.filter(f =>
        f.nom.toLowerCase().includes(t) ||
        f.prenom.toLowerCase().includes(t) ||
        f.specialites.toLowerCase().includes(t)
      ) : formateurs;
    })
  );

  loading = false;
  modalVisible = false;
  erreur: string | null = null;
  modalMode: 'add' | 'edit' = 'add';
  modalModel: Formateur = { id: 0, nom: '', prenom: '', email: '', photo: '', cv: '', cin: '', telephone: '', specialites: '' };

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.loadFormateurs();
  }

  private loadFormateurs() {
    this.loading = true;
    this.service.getFormateurs().subscribe(data => this.all$.next(data));
  }

  onSearch(term: string) {
    this.search$.next(term);
  }

  openModal(mode: 'add' | 'edit', formateur?: Formateur) {
    this.modalMode = mode;
    this.erreur = null;
    this.modalModel = formateur
      ? { ...formateur }
      : { id: 0, nom: '', prenom: '', photo: '', cv: '', email: '', cin: '', telephone: '', specialites: '' };
    this.modalVisible = true;
  }

  save() {
    if (this.modalMode === 'add') {
      this.service.createFormateur(this.modalModel).subscribe({
        next: () => { this.loadFormateurs(); this.modalVisible = false; },
        error: (err) => { this.erreur = err.error?.error || "Erreur lors de l'ajout."; }
      });
    } else {
      this.service.updateFormateur(this.modalModel.id!, this.modalModel).subscribe({
        next: () => { this.loadFormateurs(); this.modalVisible = false; },
        error: (err) => { this.erreur = err.error?.error || "Erreur lors de la mise a jour."; }
      });
    }
  }

  remove(id: number) {
    if (confirm('Supprimer ce formateur ?')) {
      this.service.deleteFormateur(id).subscribe({
        next: () => this.loadFormateurs(),
        error: (err) => alert(err.error?.error || "Erreur lors de la suppression.")
      });
    }
  }

  private readonly DEFAULT_PHOTO = 'assets/images/default.jpg';

  getPhotoUrl(photoPath: string | null | undefined): string {
    if (!photoPath || photoPath.trim() === '') return this.DEFAULT_PHOTO;
    let cleanPath = photoPath.trim();
    if (cleanPath.startsWith('assets/')) return cleanPath;
    if (!cleanPath.includes('/')) return `assets/images/${cleanPath}`;
    return cleanPath;
  }
}
