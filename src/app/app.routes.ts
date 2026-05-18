import { Routes } from '@angular/router';
import { AdminLogin } from './admin/components/admin-login/admin-login';
import{AuthGuard} from './admin/guards/auth-guard'; 
import { AdminEntry } from './admin-entry/admin-entry';
import { MesInscriptionsComponent } from './public/pages/mes-inscriptions/mes-inscriptions';
export const routes: Routes = [
  
  {path:'admin-entry',component:AdminEntry},
  
  {
    path: '',
    redirectTo:'public', //redirige vers /public
    pathMatch:'full'//correspondace exacte
  },
  {
    path:'public',
    loadChildren: () =>
      import('./public/public-module').then(m => m.PublicModule)
  },
  //route pour le module admin avec lazy loading
  /*{
    path:'admin-space',
    loadChildren:()=>import('./admin/admin-module').then(m=>m.AdminModule)
  },*/

  
  //new route for admin login
  {
    path:'admin/login',
    component:AdminLogin
  },
  {
    path:'admin',
    loadChildren:()=>import('./admin/admin-module').then(m=>m.AdminModule),
    //canActivate:[AuthGuard] //gardien de route
  },
  

];
