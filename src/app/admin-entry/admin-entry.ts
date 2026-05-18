import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-entry',
  imports: [],
  templateUrl: './admin-entry.html',
  styleUrl: './admin-entry.css',
})
export class AdminEntry {
constructor(private router:Router){}
ngOnInit(){
  setTimeout(()=>{
    this.router.navigateByUrl('/admin/dashboard',{ replaceUrl: true });
  },100
    
  );
}


}
