import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/api-service';
import { BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth-guard';
import { Stats } from '../../../core/services/stats';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);//enregistrement des composants de Chart.js

@Component({
  selector: 'app-admin-dashboard',
  standalone:false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  
})
export class AdminDashboard implements OnInit, OnDestroy {
  
  candidatsCount$ = new BehaviorSubject<number>(0);
  formateursCount$ = new BehaviorSubject<number>(0);
  formationsCount$ = new BehaviorSubject<number>(0);
  sessionsCount$ = new BehaviorSubject<number>(0); 
  candidatsChart: any;
  remplissageChart: any; 
  constructor(public service:ApiService,
    private router:Router,
    private auth:AuthService,
    private statsService:Stats
  ){} 

  ngOnInit(): void {
    console.log('je suis ngOnInitttttt');
    
    this.loadStats();
    if (!localStorage.getItem('isAdminLoggedIn')) {
  this.router.navigate(['/admin/login']);
}
//chargement des graphiques après les stats
    this.loadCandidatsChart();
    this.loadRemplissageChart();
  }
  private loadStats(){
    
    this.service.getCandidats().subscribe(data => this.candidatsCount$.next(data.length));
    this.service.getFormateurs().subscribe(data => this.formateursCount$.next(data.length));
    this.service.getFormations().subscribe(data => this.formationsCount$.next(data.length));
    this.service.getSessions().subscribe(data => this.sessionsCount$.next(data.length));
    
  }

reset() {
    if (confirm('⚠️ Voulez-vous réinitialiser toutes les données ?\n(Cette action est irréversible.)')) {
      alert("la réinitialisation des données n'est pas dispo en mode en backend");
    }
}


logout(){
  this.auth.logout();
  window.location.href='admin/login';
}

ngOnDestroy(): void {
  this.candidatsChart?.destroy();
  this.remplissageChart?.destroy();
}


loadCandidatsChart() {
    this.statsService.getCandidatsParFormation().subscribe(data => {
       console.log('Données brutes:', data);
      const labels = data.map((d: any) => d.titre);
      const values = data.map((d: any) => parseInt(d.totalCandidats));

      this.candidatsChart?.destroy();
      this.candidatsChart = new Chart('candidatsChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Nombre de candidats',
            data: values,
            backgroundColor: '#0d6efd'
          }]
        },
        options: {
          responsive: true,
           maintainAspectRatio: false, 
          plugins: {
            title: {
              display: true,
              text: 'Candidats par formation'
            }
          },
          scales: {
   x: {
  ticks: {
    autoSkip: false,
    maxRotation: 45,
    minRotation: 45,
    callback: function(value, index, ticks) {
      // Récupère le vrai label depuis les données
      const label = labels[index]; //  Utilise le tableau `labels` du scope parent
      if (!label) return '';
      
      // Coupe si trop long
      if (label.length > 25) {
        return label.substring(0, 25) + '...';
      }
      return label;
    }
  }
},
    y: {
      beginAtZero: true
    }
  }
        }
      });
      });
  }
  //
  
  //


  
  loadRemplissageChart() {
    this.statsService.getTauxRemplissage().subscribe({
      next:data => {
        console.log('données taux remplissage:',data);
      const labels = data.map((d: any) => d.session);
      const values = data.map((d: any) => d.taux);

      this.remplissageChart?.destroy();
      this.remplissageChart = new Chart('remplissageChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: '% Remplissage (max 15)',
            data: values,
            backgroundColor: values.map(v => v >= 100 ? '#dc3545' : '#28a745')
          }]
        },
         options: {
          indexAxis: 'y',
          responsive: true,
           maintainAspectRatio: false, 
          scales: {
            x: {
              max: 100,
              title: { display: true, text: 'Pourcentage' }
            }
          },
          plugins: {
            legend: { display: false },
             tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.x}% remplissage`
      }
    }
            
          }
        }
      });
    },
    error:err=> console.error('Erreur chargement taux remplissage:', err)
  });
  }

}
