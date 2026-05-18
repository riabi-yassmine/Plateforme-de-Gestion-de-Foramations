import { Categorie } from "./categorie";

export interface Formation {
  id: number;
  titre: string;
  description: string;
  chargeHoraire: number;
  programmePdf?: string; // URL du PDF
  
  niveau: string;
  tags: string;
  categories?: string;
  
}

