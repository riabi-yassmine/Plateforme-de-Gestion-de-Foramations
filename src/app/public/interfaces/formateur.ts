export interface Formateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cin: string;
  photo?: string; // optionnel 
  cv?: string; // optionnel
  specialites: string;
}
