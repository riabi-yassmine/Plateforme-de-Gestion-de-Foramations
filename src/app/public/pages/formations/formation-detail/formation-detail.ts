import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Formation } from '../../../interfaces/formation';
import { Session } from '../../../interfaces/session';

import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../admin/data-service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../../core/services/api-service';
import { Formateur } from '../../../interfaces/formateur';
import { BehaviorSubject, forkJoin,Observable } from 'rxjs';
@Component({
  selector: 'app-formation-detail',
  standalone:true,
  templateUrl: './formation-detail.html',
  styleUrl: './formation-detail.css',
  imports:[FormsModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    AsyncPipe] 
})
export class FormationDetail implements OnInit {
  formation:Formation|null|undefined=undefined;
  formateurs:Formateur[]=[];
  formateursList:Formateur[]=[];
  sessions:Session[]=[];  
loading=true;
 private _formateursLoaded = new BehaviorSubject<boolean>(false); //écriture :observable  qui gére l'état de chargement des données asynchrones
formateursLoaded$ = this._formateursLoaded.asObservable(); //lecture
 formateursMap = new Map<number, { id: number; nom: string; prenom: string; cv: string }>();
constructor(private router:Router,private route:ActivatedRoute,private api:ApiService,private cdr:ChangeDetectorRef){}
ngOnInit(): void {
  console.log('✅ FormationDetail ngOnInit appelé');
  
  const idParam = this.route.snapshot.paramMap.get('id');
  const id = Number(idParam);
  
  if (isNaN(id) || id <= 0) {
    console.error('❌ ID de formation invalide:', idParam);
    this.formation = null;
    this.loading = false;
    this.cdr.detectChanges();
    return;
  }

  this.loading = true;

  // 1. Charge d'abord la formation
  this.api.getFormationById(id).subscribe({
    next: (formation) => {
      console.log('📦 Formation reçue:', formation);
      
      this.formation = formation || null;
      
      if (this.formation) {
        // 2. Charge les sessions
        this.api.getSessionsByFormationId(id).subscribe({
          next: (sessions: Session[]) => {
            console.log('📅 Sessions reçues:', sessions);
            
            this.sessions = sessions || [];
            this.loading = false;
            
            // 3. Charge les formateurs si nécessaire
            if (this.sessions.length > 0) {
              this.loadFormateurs();
            } else {
               this._formateursLoaded.next(true);
            }

            this.cdr.detectChanges();//déclenche la détection des changements
          },
          error: (error: any) => {
            console.error('❌ Erreur sessions:', error);
            this.sessions = [];
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        // Formation non trouvée
        this.loading = false;
        //this.cdr.detectChanges();
      }
    },
    error: (error: any) => {
      console.error('❌ Erreur formation:', error);
      this.formation = null;
      this.loading = false;
      //this.cdr.detectChanges();
    }
  });
}

  ngAfterViewInit(): void {
    // Permet de gérer les mises à jour après le rendu initial
    console.log(' ngAfterViewInit appelé');
  }
  //

  private loadFormateurs(): void {
  const allFormateurIds = this.sessions.flatMap(s => s.formateursIds);
  const uniqueIds = [...new Set(allFormateurIds)];
  
  if (uniqueIds.length === 0) {
    this._formateursLoaded.next(true); // formateurs chargés
    return;
  }
  
  this.api.getFormateursById(uniqueIds).subscribe({
    next: (formateurs) => {
      this.formateursMap.clear();
      formateurs.forEach(f => {
        if (f) {
          this.formateursMap.set(f.id, {
            id: f.id,
            nom: f.nom,
            prenom: f.prenom,
            cv: f.cv || ''
          });
        }
      });
      this._formateursLoaded.next(true); //  Les formateurs sont prêts 
    },
    error: (error) => {
      console.error('❌ Erreur formateurs:', error);
      this._formateursLoaded.next(true); // Même en erreur, on arrête le chargement
    }
  });
}

  openInscriptionModal(sessionID?: number): void {
  if (sessionID) {
    this.router.navigate(['/public/inscription', sessionID]); 
  }
}
 getFormateur(id: number): { id: number; nom: string; prenom: string; cv: string } | null {
    return this.formateursMap.get(id) || null;
  }

  getStatus(session: Session): 'complet' | 'en-cours' | 'a-venir' | 'termine' {
    const now = new Date();
    const debut = new Date(session.dateDebut);
    const fin = new Date(session.dateFin);
    if (session.inscriptions.length >= 15) return 'complet';
    if (now > fin) return 'termine';
    if (now >= debut && now <= fin) return 'en-cours';
    return 'a-venir';
  }

  getFormateursNoms(formateurIds: number[]): void {
  this.api.getFormateursById(formateurIds).subscribe(formateurs => {
    this.formateursList = formateurs; // stocke dans une variable du composant
  });
}

  // Méthode pour ouvrir le PDF
 /*async openProgrammePdf(): Promise<void> {
  if (!this.formation?.programmePdf) {
    alert('⚠️ Programme non disponible.');
    return;
  }

  try {
    //  Récupère le PDF via fetch (fonctionne en local avec ng serve)
    const response = await fetch(this.formation.programmePdf);
    if (!response.ok) throw new Error('PDF non trouvé');

    const blob = await response.blob();//converssion en fichier binaire
    const url = URL.createObjectURL(blob);//url temporaire

    // Crée un lien temporaire
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.formation.titre.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();//clique automatquement

    // Nettoyage
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);//Libère la mémoire utilisée par l’URL temporaire.
    }, 100);//100ms seconde aprés le clique
  } catch (err) {
    console.error('Erreur téléchargement PDF :', err);
    alert('❌ Impossible de télécharger le PDF. Veuillez réessayer ou utiliser "Ouvrir dans un nouvel onglet".');
  }
}
*/


// Méthode pour ouvrir le CV (évite les erreurs si cv est vide)
openCv(event: MouseEvent, cvUrl: string): void {
  if (!cvUrl) {
    event.preventDefault();
    alert('⚠️ CV non disponible pour ce formateur.');
    return;
  }
  
}

imprimer() {
  /* const url = `http://localhost:3000/api/formations/${this.formation?.id}/pdf`;
  window.open(url, '_blank'); // Ouvre le PDF dans un nouvel onglet */
  
  this.api.print(this.formation?.id!).subscribe({
    next : (blob) => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); // Ouvre le PDF dans un nouvel onglet
    },
    error : (err) => console.error(err)
    
    
  })
}



}