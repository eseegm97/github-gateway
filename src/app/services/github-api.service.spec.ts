import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GithubApiService } from './github-api.service';

describe('GithubApiService', () => {
  it('returns empty results for blank search without an HTTP call', async () => {
    TestBed.configureTestingModule({
      providers: [GithubApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    const service = TestBed.inject(GithubApiService);
    const http = TestBed.inject(HttpTestingController);

    const result = await service.searchUsers('   ');

    expect(result).toEqual({
      items: [],
      page: 1,
      perPage: 10,
      totalCount: 0,
      hasNextPage: false,
    });
    http.expectNone('/api/github/search');
  });

  it('calls search endpoint and returns response data', async () => {
    TestBed.configureTestingModule({
      providers: [GithubApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    const service = TestBed.inject(GithubApiService);
    const http = TestBed.inject(HttpTestingController);

    const promise = service.searchUsers('octocat', 2, 15);
    const request = http.expectOne((req) => req.url === '/api/github/search');

    expect(request.request.params.get('username')).toBe('octocat');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('perPage')).toBe('15');
    request.flush({
      data: {
        items: [{ githubId: 1, username: 'octocat', avatarUrl: 'a', profileUrl: 'p' }],
        page: 2,
        perPage: 15,
        totalCount: 30,
        hasNextPage: true,
      },
    });

    await expect(promise).resolves.toEqual({
      items: [{ githubId: 1, username: 'octocat', avatarUrl: 'a', profileUrl: 'p' }],
      page: 2,
      perPage: 15,
      totalCount: 30,
      hasNextPage: true,
    });
  });

  it('propagates profile endpoint errors', async () => {
    TestBed.configureTestingModule({
      providers: [GithubApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    const service = TestBed.inject(GithubApiService);
    const http = TestBed.inject(HttpTestingController);

    const promise = service.getUserProfile('missing-user');
    const request = http.expectOne('/api/github/users/missing-user');
    request.flush({ error: { code: 'NOT_FOUND' } }, { status: 404, statusText: 'Not Found' });

    await expect(promise).rejects.toBeTruthy();
  });
});
