import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page">
      <h1>History</h1>
      <p>History list, revisit flow, and clear-history action will be added in the next phase.</p>
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
export class HistoryPageComponent {}