import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Formation } from '../../interfaces/formation';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../admin/data-service';
import { ApiService } from '../../../core/services/api-service';
import {  ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';


@Component({
  selector: 'app-formations',
  standalone:false,
  templateUrl: './formations.html',
  styleUrl: './formations.css',

})
export class Formations implements OnInit {
 /* @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchTerm = '';
  formations: Formation[] =[];
  //formations$= new BehaviorSubject<Formation[]>([]);
  filteredFormations: Formation[] = [];
  
  

  constructor(private api:ApiService,private router:Router,private route:ActivatedRoute,
   
  ) {}

  ngOnInit(): void {
    // Récupérez les formations depuis le service
     this.api.getFormations().subscribe({
      next: (data) => {
        
        this.formations = data;
        this.filteredFormations = [...this.formations];
      },
      error: (err) => {
        console.error('Erreur API:', err);
        alert('⚠️ Impossible de charger les formations. Backend démarré ?');
      }
    });
//focus sur le champ de recherche au chargement de la page
    
    setTimeout(() => {
    this.searchInput.nativeElement.focus();
  }, 100); 
    
  }

  filterFormations(): Formation[] {
    if (!this.searchTerm.trim()) {
      return [...this.formations];
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();
      
      return this.formations.filter(f => {
        // 1. Recherche dans le titre
        if (f.titre.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 2. Recherche dans la description
        if (f.description.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 3. Recherche dans les tags (vérifiez que f.tags existe)
        if (f.tags && Array.isArray(f.tags)) {
          if (f.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
            return true;
          }
        }
        
        return false;
      });
    }
  }
//Mise à jour immédiate à chaque frappe
  onSearchChange() {
    this.filteredFormations = this.filterFormations();
  }
  trackById(index: number, formation: Formation): number {
  return formation.id;
}*/



  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private allFormations$ = new BehaviorSubject<Formation[]>([]);
  private searchTerm$ = new BehaviorSubject<string>('');
  private niveauFilter$ = new BehaviorSubject<string>('');
  private categorieFilter$ = new BehaviorSubject<string>('');

  readonly niveaux = ['débutant', 'intermédiaire', 'avancé'];
  readonly categories = [
    { id: '1', nom: 'Développement Web' },
    { id: '2', nom: 'Programmation Orientée Objet' },
    { id: '3', nom: 'Data Science' }
  ];

  filteredFormations$ = combineLatest([
    this.allFormations$,
    this.searchTerm$,
    this.niveauFilter$,
    this.categorieFilter$
  ]).pipe(
    map(([formations, term, niveau, categorie]) => {
      const searchLower = term.toLowerCase().trim();
      return formations.filter(f => {
        const matchesSearch = !searchLower ||
          f.titre.toLowerCase().includes(searchLower) ||
          f.description.toLowerCase().includes(searchLower) ||
          f.tags.split(',').some(tag => tag.trim().toLowerCase().includes(searchLower));

        const matchesNiveau = !niveau || f.niveau === niveau;
        const matchesCategorie = !categorie || f.categories === categorie;

        return matchesSearch && matchesNiveau && matchesCategorie;
      });
    })
  );

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //  Charge les formations depuis le backend
    this.api.getFormations().subscribe({
      next: (formations) => {
        this.allFormations$.next(formations);
      },
      error: (err) => {
        console.error('Erreur API:', err);
        alert('⚠️ Impossible de charger les formations. Backend démarré ?');
      }
    });

    //  Focus sur le champ de recherche
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    }, 100);
  }

  onSearchChange(term: string): void {
    this.searchTerm$.next(term);
  }

  onNiveauChange(niveau: string): void {
    this.niveauFilter$.next(niveau);
  }

  onCategorieChange(categorie: string): void {
    this.categorieFilter$.next(categorie);
  }

  resetFilters(): void {
    this.searchTerm$.next('');
    this.niveauFilter$.next('');
    this.categorieFilter$.next('');
    this.searchInput.nativeElement.value = '';
  }

  trackById(index: number, formation: Formation): number {
    return formation.id!;
  }
}


  




