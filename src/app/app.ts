import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public router: Router) {}
  protected readonly title = signal('Iset_FormationApplication');

  get isPublicRoute(): boolean {
    return !this.router.url.startsWith('/admin') && !this.router.url.startsWith('/admin-entry');
  }
}
