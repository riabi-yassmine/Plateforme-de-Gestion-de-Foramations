import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Stats {
   private apiUrl='http://localhost:3000/api';
   constructor(private http:HttpClient){}

     getCandidatsParFormation():Observable<any[]>{
       return this.http.get<any[]>(`${this.apiUrl}/stats/candidats-par-formation`);
    }

    getTauxRemplissage(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/stats/taux-remplissage`);
  }

}
