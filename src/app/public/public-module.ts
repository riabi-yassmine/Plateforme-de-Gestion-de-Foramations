import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing-module';
import { Home } from './pages/home/home';
import { Formations } from './pages/formations/formations';
import { FormsModule } from '@angular/forms';
import { Inscription } from './pages/formations/formation-detail/inscription/inscription';
import { FormationDetail } from './pages/formations/formation-detail/formation-detail';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    Home,
    Formations,
    Inscription],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ]
})
export class PublicModule { }
