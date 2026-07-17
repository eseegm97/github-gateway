import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page">
      <h1>GitHub Gateway</h1>
      <p>Phase 1 route-first SPA foundation is active.</p>

      <section class="panel">
        <h2>Search</h2>
        <p>Search form and result list will be implemented in the next phase.</p>
      </section>

      <nav class="actions">
        <a routerLink="/favorites">Favorites</a>
        <a routerLink="/history">History</a>
      </nav>
    </main>
  `,
  styles: [
    `
      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .panel {
        border: 1px solid #d2d5dc;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
      }

      .actions {
        display: flex;
        gap: 1rem;
      }
    `,
  ],
})
export class SearchPageComponent {}