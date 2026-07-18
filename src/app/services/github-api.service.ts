import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GithubProfile, GithubSearchResult } from '../models/github-user.model';

type ApiEnvelope<T> = {
  data: T;
};

@Injectable({ providedIn: 'root' })
export class GithubApiService {
  private readonly http = inject(HttpClient);

  async searchUsers(username: string, page = 1, perPage?: number): Promise<GithubSearchResult> {
    const query = username.trim();

    if (!query) {
      return {
        items: [],
        page,
        perPage: perPage ?? 10,
        totalCount: 0,
        hasNextPage: false,
      };
    }

    const params: Record<string, string> = {
      username: query,
      page: `${page}`,
    };

    if (perPage !== undefined) {
      params['perPage'] = `${perPage}`;
    }

    const response = await firstValueFrom(
      this.http.get<ApiEnvelope<GithubSearchResult>>('/api/github/search', {
        params,
      }),
    );

    return response.data;
  }

  async getUserProfile(login: string): Promise<GithubProfile> {
    const response = await firstValueFrom(
      this.http.get<ApiEnvelope<GithubProfile>>(`/api/github/users/${encodeURIComponent(login)}`),
    );

    return response.data;
  }
}