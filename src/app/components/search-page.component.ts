import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GithubUser } from '../models/github-user.model';
import { mapApiErrorToMessage } from '../services/api-error.util';
import { GithubApiService } from '../services/github-api.service';
import { HistoryService } from '../services/history.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="page-shell">
      <section class="hero mb-4">
        <h1 class="display-6 fw-bold mb-2">Discover GitHub Profiles</h1>
        <p class="text-secondary mb-0">
          Search by username. Exact matches are surfaced first, followed by partial matches.
        </p>
      </section>

      <section class="section-card p-3 p-md-4 mb-4">
        <form class="row g-3 align-items-end" (ngSubmit)="onSubmitSearch()">
          <div class="col-12 col-md">
            <label for="search" class="form-label fw-semibold">Username</label>
            <input
              id="search"
              name="search"
              class="form-control form-control-lg"
              [ngModel]="query()"
              (ngModelChange)="onQueryChange($event)"
              placeholder="Type a GitHub username"
              autocomplete="off"
            />
          </div>
          <div class="col-12 col-md-auto">
            <button class="btn btn-primary btn-lg w-100" type="submit" [disabled]="!query().trim()">
              Save Search
            </button>
          </div>
        </form>

        @if (searching()) {
          <div class="alert alert-info mt-3 mb-0 py-2">Searching...</div>
        }

        @if (error()) {
          <div class="alert alert-danger mt-3 mb-0 py-2">{{ error() }}</div>
        }

        @if (query().trim() && !error()) {
          <div class="small text-secondary mt-3">
            Showing {{ results().length }} of {{ totalCount() }} matches (page {{ currentPage() }}).
          </div>
        }
      </section>

      <section class="section-card p-3 p-md-4">
        <h2 class="h4 fw-semibold mb-3">Results</h2>
        @if (!query().trim()) {
          <p class="text-secondary mb-0">Start typing to search for users.</p>
        } @else if (!searching() && results().length === 0) {
          <p class="text-secondary mb-0">No users found for "{{ query().trim() }}".</p>
        } @else {
          <ul class="list-group list-group-flush">
            @for (user of results(); track user.githubId) {
              <li class="list-group-item px-0 py-3 d-flex align-items-center gap-3">
                <img class="avatar" [src]="user.avatarUrl" [alt]="user.username + ' avatar'" loading="lazy" />
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center w-100 gap-2">
                  <div class="d-flex align-items-center gap-2">
                    <strong class="fs-5">{{ user.username }}</strong>
                    @if (isExactMatch(user)) {
                      <span class="badge rounded-pill text-bg-success">Exact</span>
                    }
                  </div>
                  <a
                    class="btn btn-outline-primary btn-sm"
                    [routerLink]="['/profile', user.username]"
                    [queryParams]="{ q: query().trim() }"
                  >
                    View Profile
                  </a>
                </div>
              </li>
            }
          </ul>

          <div class="d-flex flex-wrap gap-2 justify-content-end mt-3">
            <button
              class="btn btn-outline-secondary"
              type="button"
              (click)="goToPreviousPage()"
              [disabled]="searching() || currentPage() <= 1"
            >
              Previous
            </button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              (click)="goToNextPage()"
              [disabled]="searching() || !hasNextPage()"
            >
              Next
            </button>
          </div>
        }
      </section>

    </main>
  `,
  styles: [
    `
      .hero {
        background: linear-gradient(145deg, rgba(13, 110, 253, 0.14), rgba(0, 184, 148, 0.12));
        border: 1px solid #cfe0ff;
        border-radius: 16px;
        padding: 1.25rem;
      }

      .avatar {
        width: 54px;
        height: 54px;
        border-radius: 50%;
      }
    `,
  ],
})
export class SearchPageComponent {
  private readonly githubApi = inject(GithubApiService);
  private readonly historyService = inject(HistoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly queryInput$ = new Subject<string>();

  readonly query = signal('');
  readonly results = signal<GithubUser[]>([]);
  readonly searching = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly totalCount = signal(0);
  readonly hasNextPage = signal(false);

  constructor() {
    this.queryInput$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((value) => {
          const trimmed = value.trim();
          this.currentPage.set(1);

          if (!trimmed) {
            this.results.set([]);
            this.error.set(null);
            this.totalCount.set(0);
            this.hasNextPage.set(false);
            return of<GithubUser[]>([]);
          }

          return from(this.runSearch(trimmed, 1));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((users) => {
        this.results.set(users);
      });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const q = params.get('q')?.trim();

      if (q && q !== this.query()) {
        this.query.set(q);
        this.queryInput$.next(q);
      }
    });
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.queryInput$.next(value);
  }

  async goToPreviousPage(): Promise<void> {
    const trimmed = this.query().trim();

    if (!trimmed || this.currentPage() <= 1) {
      return;
    }

    await this.runSearch(trimmed, this.currentPage() - 1);
  }

  async goToNextPage(): Promise<void> {
    const trimmed = this.query().trim();

    if (!trimmed || !this.hasNextPage()) {
      return;
    }

    await this.runSearch(trimmed, this.currentPage() + 1);
  }

  async onSubmitSearch(): Promise<void> {
    const trimmed = this.query().trim();

    if (!trimmed) {
      return;
    }

    try {
      await this.historyService.addEntry({ query: trimmed });
    } catch {
      this.error.set('Search ran, but history could not be saved.');
    }
  }

  private async runSearch(query: string, page: number): Promise<GithubUser[]> {
    this.searching.set(true);
    this.error.set(null);

    try {
      const result = await this.githubApi.searchUsers(query, page);
      this.currentPage.set(result.page);
      this.totalCount.set(result.totalCount);
      this.hasNextPage.set(result.hasNextPage);
      this.results.set(result.items);
      return result.items;
    } catch (error) {
      this.error.set(mapApiErrorToMessage(error, 'Unable to search GitHub users right now.'));
      this.totalCount.set(0);
      this.hasNextPage.set(false);
      return [];
    } finally {
      this.searching.set(false);
    }
  }

  isExactMatch(user: GithubUser): boolean {
    return user.username.toLowerCase() === this.query().trim().toLowerCase();
  }
}