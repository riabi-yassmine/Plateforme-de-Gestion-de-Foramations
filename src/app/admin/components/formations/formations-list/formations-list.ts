import { Component, OnInit } from '@angular/core';
import { Formation } from '../../../../public/interfaces/formation';
import { DataService } from '../../../data-service';
import { ApiService } from '../../../../core/services/api-service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-formations-list',
  standalone:false,
  templateUrl: './formations-list.html',
  styleUrl: './formations-list.css',
})
export class FormationsList  implements OnInit{
//formations:Formation[]=[];
formations$=new BehaviorSubject<Formation[]>([]);
loading=false;
modalVisible = false;
  modalMode: 'add' | 'edit' = 'add';
  modalModel: Formation = {
    id: 0,
    titre: '',
    description: '',
    chargeHoraire: 0,
    programmePdf: '',
    niveau: 'débutant',
    tags: '',
    categories:'1' 
  };
  constructor(private service:ApiService){}
   ngOnInit() {
    //this.formations = this.service.getFormations();
    this.loadFormations();
  }
  /*updateTags(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.modalModel.tags = value.split(',').map(t => t.trim()).filter(t => t);
  }
 openModal(mode: 'add' | 'edit', formation?: Formation) {
    this.modalMode = mode;
    this.modalModel = formation ? { ...formation } : { ...this.modalModel };
    this.modalVisible = true;
  }
save() {
    if (this.modalMode === 'add') {
      this.service.addFormation(this.modalModel);
    } else {
      this.service.saveFormations(
        this.formations.map(f => f.id === this.modalModel.id ? this.modalModel : f)
      );
    }
    this.formations = this.service.getFormations();
    this.modalVisible = false;
  }
  remove(id: number) {
    if (confirm('Supprimer cette formation ?\n⚠️ Les sessions associées seront perdues.')) {
      this.formations = this.formations.filter(f => f.id !== id);
      this.service.saveFormations(this.formations);
    }
  }*/

     private loadFormations() {
    this.loading = true;
    /*this.service.getFormations().subscribe({
      next: (data) => {
        this.formations= data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement formations:', err);
        this.loading = false;
        alert('❌ Impossible de charger les formations.');
      }
    });*/
    this.service.getFormations().subscribe(data=>this.formations$.next(data));
  }

  updateTags(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.modalModel.tags = value;
  }

  openModal(mode: 'add' | 'edit', formation?: Formation) {
    this.modalMode = mode;
    this.modalModel = formation ? { ...formation } : { ...this.modalModel };
    this.modalVisible = true;
  }



  save() {
    if (this.modalMode === 'add') {
      this.service.createFormation(this.modalModel).subscribe({
        next: () => {
          this.loadFormations();
          this.modalVisible = false;
        },
        error: (err) => {
          console.error('Erreur ajout formation:', err);
          alert('❌ Erreur lors de l’ajout.');
        }
      });
    } else {
      this.service.updateFormation(this.modalModel.id!, this.modalModel).subscribe({
        next: () => {
          this.loadFormations();
          this.modalVisible = false;
        },
        error: (err) => {
          console.error('Erreur mise à jour formation:', err);
          alert('❌ Erreur lors de la mise à jour.');
        }
      });
    }
  }



remove(id: number) {
    if (confirm('Supprimer cette formation ?')) {
      this.service.deleteFormation(id).subscribe({
        next: () => {
          this.loadFormations();
        },
        error: (err) => {
          console.error('Erreur suppression formateur:', err);
          alert('❌ Erreur lors de la suppression.');
        }
      });
    }
  }

}
