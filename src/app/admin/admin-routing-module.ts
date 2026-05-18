import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHome } from './pages/admin-home/admin-home';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { FormateursList } from './components/formateurs/formateurs-list/formateurs-list';
import { FormationsList } from './components/formations/formations-list/formations-list';
import { SessionsList } from './components/sessions/sessions-list/sessions-list';
import { CandidatsListComponent } from './components/candidats/candidats-list/candidats-list';
import { AuthGuard } from './guards/auth-guard';
import { Inscriptions } from './components/inscriptions/inscriptions';


const routes: Routes = [
  {path:'',component:AdminHome,
    canActivate:[AuthGuard],
    children:[
      {path:'',redirectTo:'',pathMatch:'full'},
      { path: 'dashboard', component: AdminDashboard},
      { path: 'candidats',component:CandidatsListComponent},
      { path: 'formateurs', component: FormateursList },
      { path: 'formations', component: FormationsList},
      { path: 'sessions', component: SessionsList },
      { path: 'inscriptions', component: Inscriptions },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
