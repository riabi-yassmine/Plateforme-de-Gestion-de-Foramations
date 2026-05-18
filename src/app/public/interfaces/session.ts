import { Candidat } from "./candidat";
import { Formateur } from "./formateur";
import { Formation } from "./formation";
import { Inscription } from "./inscription";

export interface Session {
  id: number;
  formationId: number;
  formateursIds: number[];
  dateDebut: string;
  dateFin: string;
  description: string;
  inscriptions: Inscription[];
  salle?: string;
  heureDebut?: string;
  heureFin?: string;
}

