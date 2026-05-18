import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Candidat } from '../../../../public/interfaces/candidat';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-candidats-form',
  imports: [FormsModule],
  templateUrl: './candidats-form.html',
  styleUrl: './candidats-form.css',
})
export class CandidatsForm {
 @Input()editMode=false;
 @Input() initialData:Partial<Candidat>={};
 @Output()submitted=new EventEmitter<Candidat>();
 @Output()canceled=new EventEmitter<void>();
  model: Candidat = {
    id: 0,
    nom: '',
    prenom: '',
    email: ''
  };
  ngOnInit() {
    if (this.initialData) {
      this.model = { ...this.model, ...this.initialData };
    }
  }
  onSubmit() {
    this.submitted.emit(this.model);
  }

  onCancel() {
    this.canceled.emit();
  }
}
