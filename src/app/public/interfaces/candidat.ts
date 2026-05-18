import { Formateur } from "./formateur";
import { Formation } from "./formation";

export interface Candidat {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  /*cin: string;
  photo: string;
  motDePasse: string; // 
*/

Session?: {
    id: number;
    description?: string;
    dateDebut?:string;
    dateFin?:string
    formation?: {
      id: number;
      titre: string;
    };
  };
  }
