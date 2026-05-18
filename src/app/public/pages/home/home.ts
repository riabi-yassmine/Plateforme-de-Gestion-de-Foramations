import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Categorie } from '../../interfaces/categorie';
//import { ApiService } from '../../../core/services/api-service';
import { DataService } from '../../../admin/data-service';
import { ApiService } from '../../../core/services/api-service';



@Component({
  selector: 'app-home',
  
  standalone:false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home  implements OnInit{
  categories:Categorie[]=[];
  constructor(private service:ApiService,
    private cdr:ChangeDetectorRef
  ){}
ngOnInit(): void {
  
  this.service.getCategorieList$().subscribe(categories=>{
    this.categories=categories;
    this.cdr.detectChanges();
    console.log('Categories chargées:', this.categories);
  });
}
}
