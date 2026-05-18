import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Formations } from './pages/formations/formations';
import { FormationDetail } from './pages/formations/formation-detail/formation-detail';
import { Inscription } from './pages/formations/formation-detail/inscription/inscription';
import { Home } from './pages/home/home';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesInscriptionsComponent } from './pages/mes-inscriptions/mes-inscriptions';


const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  //si l'url est vide redirige vers accueil
  {path: 'accueil',component:Home},
  {path:'formations',component:Formations},
  
  { path: 'inscription/:sessionID', component: Inscription},
  { 
    path: 'formations/:id', 
    loadComponent: () => import('./pages/formations/formation-detail/formation-detail').then(m => m.FormationDetail)
  },
  { 
    path: 'formations/:id/inscription/:sessionID', 
    loadComponent: () => import('./pages/formations/formation-detail/inscription/inscription').then(m => m.Inscription)
  },
  {
  path: 'mes-inscriptions',
  component: MesInscriptionsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes),CommonModule,FormsModule],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
