import { Candidat } from "./candidat";
import { Session } from "./session";

export interface Inscription {
  id?: number;
  candidat: Candidat;
  session: Session;
  dateInscription: Date;
  candidatId: number;
  sessionId: number;
}
