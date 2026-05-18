import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { Formation } from '../../public/interfaces/formation';
import { Formateur } from '../../public/interfaces/formateur';
import { Session } from '../../public/interfaces/session';
import { Formations } from '../../public/pages/formations/formations';
import { Candidat } from '../../public/interfaces/candidat';
import { AdminLogin } from '../../admin/components/admin-login/admin-login';
import { Categorie } from '../../public/interfaces/categorie';
//import { firstValueFrom } from 'rxjs';
import { combineLatest } from 'rxjs';
//import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl="http://localhost:3000/api";//url de base de l'api backend
  constructor(private http:HttpClient){}
  getFormations():Observable<Formation[]>{
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`);
  }
  getFormationById(id: number): Observable<Formation|undefined>{
    return this.getFormations().pipe(
      map(Formations => Formations.find(f=>f.id===id))
    );
  }
  getFormateurs():Observable<Formateur[]>{
    return this.http.get<Formateur[]>(`${this.apiUrl}/formateurs`);
  }
  getFormateursById(ids: number[]): Observable<Formateur[]> {
  return this.getFormateurs().pipe(
    map(formateurs => formateurs.filter(f => ids.includes(f.id)))
  );
}
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions`);
  }

  getCandidats():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/candidats`);
  }
  createCandidat(candidat: Candidat): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidats`, candidat);
  }
  updateCandidat(id: number, candidat: Candidat): Observable<any> {
    return this.http.put(`${this.apiUrl}/candidats/${id}`, candidat);
  }
  deleteCandidat(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/candidats/${id}`);
  }
  
  getSessionsByFormationId(formationId: number):Observable< Session[] >{
      return this.getSessions().pipe(
      map(sessions => sessions.filter(s => s.formationId === formationId))
    );
    }
    //inscrire un candidat dans une session
    inscrire(sessionId: number, candidat: Candidat): Observable<any> {
      return this.http.post(`${this.apiUrl}/inscriptions/${sessionId}/inscription`, candidat);
}
//crud formateur
createFormateur(formateur:any):Observable<any>{
 return this.http.post(`${this.apiUrl}/formateurs`,formateur);
}
updateFormateur(id:number, formateur:any):Observable<any>{
 return this.http.put(`${this.apiUrl}/formateurs/${id}`,formateur);
}

deleteFormateur(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/formateurs/${id}`);
}
//crud formation
createFormation(formation: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/formations`, formation);
}

updateFormation(id: number, formation: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/formations/${id}`, formation);
}

deleteFormation(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/formations/${id}`);
}
//crud session
createSession(session: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/sessions`, session);
}

updateSession(id: number, session: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/sessions/${id}`, session);
}

deleteSession(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/sessions/${id}`);
}

//méthode de login
loginAdmin(Credentials:{email:string;password:string}):Observable<any>{
  return this.http.post(`${this.apiUrl}/admin/login`, Credentials);
}


//méthode d'impression
public print(id : number)  {
 return  this.http.get(`http://localhost:3000/api/formations/${id}/pdf` , {responseType : 'blob'}) //recevoir le pdf sous la forme de blob
}

//les catégories
 /*async getCategorieList(): Promise<Categorie[]> {
  const categoryIds = new Set<number>();

  // Récupère les formations
  const formations = await firstValueFrom(this.getFormations());

  formations.forEach(f => {
    if (f.categories && typeof f.categories === 'string') {
      const ids = f.categories
        .split(',')
        .map(id => id.trim())
        .filter(id => /^\d+$/.test(id)) // Garde seulement les chaînes numériques
        .map(Number);

      ids.forEach(id => categoryIds.add(id));
    }
  });

  // Récupère les catégories
  const categories = await firstValueFrom(this.getCategories());

  return categories.filter(cat => categoryIds.has(cat.id));
}*/
/*getCategorieList(): Observable<Categorie[]> {
  return combineLatest([
    this.getFormations(),
    this.getCategories()
  ]).pipe(
    map(([formations, categories]) => {
      const categoryIds = new Set<number>();

      formations.forEach(f => {
        if (f.categories && typeof f.categories === 'string') {
          const ids = f.categories
            .split(',')
            .map(id => id.trim())
            .filter(id => /^\d+$/.test(id))
            .map(Number);

          ids.forEach(id => categoryIds.add(id));
        }
      });

      return categories.filter(cat => categoryIds.has(cat.id));
    })
  );
}*/

getInscriptions() {
  return this.http.get<any[]>('http://localhost:3000/api/inscriptions');
}


//méthode pour les catégories
getCategorieList$():Observable<Categorie[]>{
  return this.http.get<Formation[]>(`${this.apiUrl}/formations`).pipe(
    map(formations=>{
      const categoryIds = new Set<number>();
      formations.forEach(f=>{
        if(f.categories && typeof f.categories === 'string'){
          const ids = f.categories
          .split(',')
          .map(id=>id.trim())
          .filter(id=>/^\d+$/.test(id))
          .map(Number);
          ids.forEach(id=>categoryIds.add(id));
        }
      });
      const allCategories: Categorie[] = [
          { id: 1, nom: 'Développement Web' },
          { id: 2, nom: 'Programmation Orientée Objet' },
          { id: 3, nom: 'Data Science' }
        ];
        return allCategories.filter(cat => categoryIds.has(cat.id));
    })
  );
}

getInitialCategories(): Categorie[] {
    return [
      { id: 1, nom: 'Développement Web' },
      { id: 2, nom: 'Programmation Orientée Objet' },
      { id: 3, nom: 'Data Science' }
    ];
  }

//méthodes pour mes-inscriptions
// Récupérer les inscriptions d’un candidat
getMesInscriptions(data: { nom: string; prenom: string; email: string }) {
  return this.http.post<any[]>(`${this.apiUrl}/inscriptions/mes-inscriptions`, data).pipe(
    timeout(15000)
  );
}

// Annuler une inscription
annulerInscription(candidatId: number, sessionId: number) {
  return this.http.delete(`${this.apiUrl}/inscriptions/${candidatId}/${sessionId}`);
}

}



