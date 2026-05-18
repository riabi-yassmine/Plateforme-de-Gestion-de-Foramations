import { Component, OnInit } from '@angular/core';
import { Candidat } from '../../../../public/interfaces/candidat';
import { ApiService } from '../../../../core/services/api-service';

@Component({
  selector: 'app-candidats-list',
  standalone: false,
  templateUrl: './candidats-list.html',
})
export class CandidatsListComponent implements OnInit {
  private all: Candidat[] = [];
  filtered: Candidat[] = [];
  paged: Candidat[] = [];

  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 10;
  totalPages = 0;

  modalVisible = false;
  isEditing = false;
  modalModel: Candidat = { nom: '', prenom: '', email: '' };
  erreur: string | null = null;

  constructor(public service: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.service.getCandidats().subscribe({
      next: data => {
        this.all = data;
        this.applyFilter();
      },
      error: err => {
        console.error('Erreur chargement candidats:', err);
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilter();
  }

  private applyFilter() {
    const t = this.searchTerm.toLowerCase().trim();
    this.filtered = t
      ? this.all.filter(c =>
          c.nom.toLowerCase().includes(t) ||
          c.prenom.toLowerCase().includes(t) ||
          c.email.toLowerCase().includes(t)
        )
      : [...this.all];
    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);
    this.updatePage();
  }

  private updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paged = this.filtered.slice(start, start + this.pageSize);
  }

  setPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.updatePage();
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openAdd() {
    this.isEditing = false;
    this.modalModel = { nom: '', prenom: '', email: '' };
    this.erreur = null;
    this.modalVisible = true;
  }

  openModal(candidat: Candidat) {
    this.isEditing = true;
    this.modalModel = { ...candidat };
    this.erreur = null;
    this.modalVisible = true;
  }

  save() {
    this.erreur = null;
    if (this.isEditing) {
      this.service.updateCandidat(this.modalModel.id!, this.modalModel).subscribe({
        next: () => { this.load(); this.modalVisible = false; },
        error: () => { this.erreur = 'Erreur lors de la mise à jour.'; }
      });
    } else {
      this.service.createCandidat(this.modalModel).subscribe({
        next: () => { this.load(); this.modalVisible = false; },
        error: () => { this.erreur = 'Erreur lors de la création.'; }
      });
    }
  }

  remove(id: number) {
    if (confirm('Supprimer ce candidat ? Ses inscriptions seront aussi supprimées.')) {
      this.service.deleteCandidat(id).subscribe(() => this.load());
    }
  }
}
