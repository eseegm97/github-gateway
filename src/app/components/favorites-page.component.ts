import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page">
      <h1>Favorites</h1>
      <p>This view will support full favorites CRUD in the next phase.</p>
      <a routerLink="/">Back to Search</a>
    </main>
  `,
  styles: [
    `
      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
    `,
  ],
})
export class FavoritesPageComponent {}