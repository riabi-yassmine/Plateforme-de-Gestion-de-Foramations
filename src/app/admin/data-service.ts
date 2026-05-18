import { Injectable } from '@angular/core';
import { Formateur } from '../public/interfaces/formateur';
import { Candidat } from '../public/interfaces/candidat';
import { Formation } from '../public/interfaces/formation';
import { Session } from '../public/interfaces/session';
import { Categorie } from '../public/interfaces/categorie';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  /* private readonly CANDIDATS_KEY = 'admin_candidats';
   private readonly FORMATEURS_KEY = 'admin_formateurs';
   private readonly FORMATIONS_KEY = 'admin_formations';
   private readonly SESSIONS_KEY = 'admin_sessions'; */


  constructor(
    private http: HttpClient
  ) { }

  // récupère les donnés de local storage ou les initialise
  /*private loadFromStorage<T>(key: string, initialData: T[]): T[] {
    const data = localStorage.getItem(key);
    return data ? this.parseWithDates(data) : initialData;
  }
//stockage les chaines json dans le local storage
  private saveToStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }*/

  //  Gère la conversion string → number pour les IDs après JSON.parse
  private parseWithDates(json: string): any {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        // Convertir les IDs en number
        const converted = { ...item };
        if (typeof converted.id === 'string') converted.id = Number(converted.id);
        if (typeof converted.formationId === 'string') converted.formationId = Number(converted.formationId);
        if (Array.isArray(converted.formateursIds)) {
          converted.formateursIds = converted.formateursIds.map((id: any) => {
            return typeof id === 'string' ? Number(id) : id;
          });
        }

        if (Array.isArray(converted.categories)) {
          converted.categories = converted.categories.map((id: any) => {
            return typeof id === 'string' ? Number(id) : id;
          });
        }
        return converted;
      });
    }
    return parsed;
  }

  // --- Données initiales ---
  private getInitialFormateurs(): Formateur[] {
    return [
      {
        id: 1,
        nom: 'jomaa',
        prenom: 'Jamil',
        email: 'jamiljomaa@gmail.com',
        telephone: '27112445',
        cin: '12345678',
        photo: 'assets/photos/jamil.jpg',
        cv: 'assets/cv/jamil.pdf',
        specialites: 'Angular,Node.js'
      },
      {
        id: 2,
        nom: 'Ben Slimen',
        prenom: 'Sarra',
        email: 'sarra.benslimen@gmail.com',
        telephone: '27188302',
        cin: '12345679',
        photo: 'assets/photos/sarra.jpg',
        cv: 'assets/cv/sarra.pdf',
        specialites: 'Java,POO'
      },
      {
        id: 3,
        nom: 'Dellai',
        prenom: 'Souha',
        email: 'souha.dellai@gmail.com',
        telephone: '22146305',
        cin: '14718820',
        photo: 'assets/photos/souha.jpg',
        cv: 'assets/cv/souha.pdf',
        specialites: 'Python,POO'
      }
    ];
  }

  private getInitialCategories(): Categorie[] {
    return [
      { id: 1, nom: 'Développement Web' },
      { id: 2, nom: 'Programmation Orientée Objet' },
      { id: 3, nom: 'Data Science' }
    ];
  }

  private getInitialFormations(): Formation[] {

    let lstFormations: Formation[] = [];
    this.http.get('http://localhost:3000/api/formations')
      .subscribe({
        next: (data: any) => {
          lstFormations = data;
          console.log('aaaaaaaaaaaaa' + lstFormations);

        },
        error: (error) => {
          console.error('Erreur lors de la récupération des formations :', error);
        }
      });

    return lstFormations;
    return [
      {
        id: 1,
        titre: 'Angular avancé',
        description: 'Formation accélérée sur Angular, alliant théorie et pratique : de la structure modulaire aux bonnes pratiques de développement, pour produire des applications robustes et maintenables.',
        chargeHoraire: 40,
        programmePdf: 'assets/programmes/angular.pdf',
        niveau: 'avance',
        tags: 'angular,typeScript,rxJS',
        categories: '1'
      },
      {
        id: 2,
        titre: 'java',
        description: 'Apprenez les concepts avancés de java pour devenez opérationnel en Java et POO : modélisation, encapsulation, polymorphisme et tests unitaires — à travers des exercices progressifs et un mini-projet final.',
        chargeHoraire: 35,
        programmePdf: 'assets/programmes/java.pdf',
        niveau: 'intermediaire',
        tags: 'java,poo,jvm',
        categories: '1'
      },
      {
        id: 3,
        titre: 'python ',
        description: 'Apprenez les concepts fondamentaux de python et découvrez le en mode POO ! Une initiation progressive pour débutants et intermédiaires : de la syntaxe de base à la modélisation objet, avec des exemples concrets et un mini-projet ludique',
        chargeHoraire: 35,
        programmePdf: 'assets/programmes/python.pdf',
        niveau: 'debutant',
        tags: 'python,developpement,thonny',
        categories: '1,2'
      },
      {
        id: 4,
        titre: 'Data science ',
        description: 'Apprenez les concepts fondamentaux de data science dans une Une formation 100% débutante pour découvrir ce métier passionnant, apprendre à parler le langage des données et réaliser vos premières analyses. Aucun prérequis en programmation nécessaire',
        chargeHoraire: 30,
        programmePdf: 'assets/programmes/dataScience.pdf',
        niveau: 'debutant',
        tags: 'data,science,information',
        categories: '3'
      }
    ];
  }

  /*private getInitialSessions(): Session[] {
    return [
      {
        id: 1,
        formationId: 1,
        formateursIds: [3,1],
        candidats: [],
        dateDebut: '2026-12-01',
        dateFin: '2026-01-07',
        description: 'Formation accélérée sur Angular, alliant théorie et pratique : de la structure modulaire aux bonnes pratiques de développement, pour produire des applications robustes et maintenables.'
      },
      {
        id: 2,
        formationId: 2,
        formateursIds: [2],
        candidats: [],
        dateDebut: '2026-01-01',
        dateFin: '2026-02-07',
        description: 'Devenez opérationnel en Java et POO : modélisation, encapsulation, polymorphisme et tests unitaires — à travers des exercices progressifs et un mini-projet final.'
      },
      {
        id: 3,
        formationId: 3,
        formateursIds: [1],
        candidats: [],
        dateDebut: '2026-12-08',
        dateFin: '2026-01-15',
        description: 'Découvrez Python en mode POO ! Une initiation progressive pour débutants et intermédiaires : de la syntaxe de base à la modélisation objet, avec des exemples concrets et un mini-projet ludique.'
      },
      {
        id: 4,
        formationId: 4,
        formateursIds: [2],
        candidats: [],
        dateDebut: '2026-01-08',
        dateFin: '2026-02-15',
        description: 'Vos premiers pas en Data Science. Une formation 100% débutante pour découvrir ce métier passionnant, apprendre à parler le langage des données et réaliser vos premières analyses. Aucun prérequis en programmation nécessaire'
      }
    ];
  }*/

  /*private getInitialCandidats(): Candidat[] {
    return [];
  }

  // --- CRUD Formateurs ---
  getFormateurs(): Formateur[] {
    return this.loadFromStorage(this.FORMATEURS_KEY, this.getInitialFormateurs());
  }
  saveFormateurs(formateurs: Formateur[]): void {
    this.saveToStorage(this.FORMATEURS_KEY, formateurs);
  }*/
  /*addFormateur(formateur: Formateur): void {
    const list = this.getFormateurs();
    const newId = list.length ? Math.max(...list.map(f => f.id)) + 1 : 1;
    this.saveFormateurs([...list, { ...formateur, id: newId }]);
  }*/

  // --- CRUD Formations ---
  /*getFormations(): Formation[] {
    return this.loadFromStorage(this.FORMATIONS_KEY, this.getInitialFormations());
  }*/
  private getFormations(): Formation[] {

    let lstFormations: Formation[] = [];
    this.http.get('http://localhost:3000/api/formations')
      .subscribe({
        next: (data: any) => {
          lstFormations = data;
          console.log('aaaaaaaaaaaaa' + lstFormations);

        },
        error: (error) => {
          console.error('Erreur lors de la récupération des formations :', error);
        }
      });

    return lstFormations;
  }

  /* saveFormations(formations: Formation[]): void {
    this.saveToStorage(this.FORMATIONS_KEY, formations);
  }
  addFormation(formation: Formation): void {
    const list = this.getFormations();
    const newId = list.length ? Math.max(...list.map(f => f.id)) + 1 : 1;
    this.saveFormations([...list, { ...formation, id: newId }]);
  } */

  // --- CRUD Sessions ---
  /*getSessions(): Session[] {
    return this.loadFromStorage(this.SESSIONS_KEY, this.getInitialSessions());
  }
  saveSessions(sessions: Session[]): void {
    this.saveToStorage(this.SESSIONS_KEY, sessions);
  }
  addSession(session: Session): void {
    const list = this.getSessions();
    const newId = list.length ? Math.max(...list.map(s => s.id)) + 1 : 1;
    this.saveSessions([...list, { ...session, id: newId }]);
  }*/

  // --- CRUD Candidats ---
  /*getCandidats(): Candidat[] {
     return this.loadFromStorage(this.CANDIDATS_KEY, this.getInitialCandidats());
   }
   saveCandidats(candidats: Candidat[]): void {
     this.saveToStorage(this.CANDIDATS_KEY, candidats);
   }
   addCandidat(candidat: Candidat): void {
   const list = this.getCandidats();
   const newId = list.length ? Math.max(...list.map(c => c.id || 0)) + 1 : 1;
   this.saveCandidats([...list, { ...candidat, id: newId }]);
 }
 
 updateCandidat(updated: Candidat): void {
   const list = this.getCandidats();
   const index = list.findIndex(c => c.id === updated.id);
   if (index !== -1) {
     list[index] = updated;
     this.saveCandidats(list);
   }
 }
 
 deleteCandidat(id: number): void {
   const list = this.getCandidats().filter(c => c.id !== id);
   this.saveCandidats(list);
 }*/

  // --- Méthodes publiques (ex: pour l'espace client) ---
  /*getFormationById(id: number): Formation | undefined {
    return this.getFormations().find(f => f.id === id);
  }

  getSessionsByFormationId(formationId: number): Session[] {
    return this.getSessions().filter(s => s.formationId === formationId);
  }

  getFormateurById(id: number): Formateur | undefined {
    return this.getFormateurs().find(f => f.id === id);
  }

  getFormateursByIds(ids: number[]): Formateur[] {
    return ids.map(id => this.getFormateurById(id)!).filter(f => f != null);
  }*/

  getCategories(): Categorie[] {
    return this.getInitialCategories();
  }

  getCategorieById(id: number): Categorie | undefined {
    return this.getCategories().find(c => c.id === id);
  }

  getCategorieList(): Categorie[] {
    const categoryIds = new Set<number>();

    this.getFormations().forEach(f => {
      if (f.categories) {
        //  Convertit "1,2,3" en [1, 2, 3]
        const ids = f.categories
          .split(',')
          .map(id => id.trim())
          .filter(id => id !== '')
          .map(Number);

        ids.forEach(id => categoryIds.add(id));
      }
    });
    return this.getCategories().filter(cat => categoryIds.has(cat.id));
  }

  /*getFormationIdBySessionId(sessionId: number): number | null {
    const session = this.getSessions().find(s => s.id === sessionId);
    return session ? session.formationId : null;
  }

  // --- Inscription (client → admin) ---
 /* inscrireCandidat(sessionId: number, candidat: Candidat): { success: boolean; message: string } {
  const sessions = this.getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) {
    return { success: false, message: 'Session introuvable.' };
  }

  if (session.candidats.length >= 15) {
    return { success: false, message: 'Session complète (15 candidats max).' };
  }

  const emailExiste = session.candidats.some(c => 
    c.email.toLowerCase() === candidat.email.toLowerCase()
  );

  if (emailExiste) {
    return { success: false, message: 'Vous êtes déjà inscrit à cette session.' };
  }

  //  Ajoute le candidat à la session
  session.candidats.push({ ...candidat });

  // Ajoute aussi dans la liste globale des candidats (pour l'admin)
  const allCandidats = this.getCandidats();
  const existingCandidat = allCandidats.find(c => c.email === candidat.email);
  
  if (!existingCandidat) {
    // Nouveau candidat → ajoute-le
    allCandidats.push({ ...candidat, id: allCandidats.length ? Math.max(...allCandidats.map(c => c.id || 0)) + 1 : 1 });
    this.saveCandidats(allCandidats); // ⬅️ sauvegarde dans localStorage
  }
  // Si déjà existant, on ne fait rien — il est déjà dans la liste

  // Sauvegarde les sessions
  this.saveSessions(sessions);

  return { success: true, message: 'Inscription réussie.' };
}*/

  // --- Réinitialisation ---
  /* resetAll(): void {
     localStorage.removeItem(this.CANDIDATS_KEY);
     localStorage.removeItem(this.FORMATEURS_KEY);
     localStorage.removeItem(this.FORMATIONS_KEY);
     localStorage.removeItem(this.SESSIONS_KEY);
     location.reload();
   }*/
}


