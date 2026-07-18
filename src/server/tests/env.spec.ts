import { describe, expect, it } from 'vitest';
import { loadEnv } from '../env';

describe('loadEnv', () => {
  it('uses defaults when variables are missing', () => {
    const env = loadEnv({});

    expect(env.githubApiBaseUrl).toBe('https://api.github.com');
    expect(env.mongodbUri).toBe('mongodb://127.0.0.1:27017/github-gateway');
    expect(env.port).toBe(4000);
    expect(env.corsOrigin).toBe('http://localhost:4200');
    expect(env.githubToken).toBe('');
    expect(env.searchDefaultPerPage).toBe(10);
    expect(env.searchMaxPerPage).toBe(25);
  });

  it('throws for invalid URLs and ports', () => {
    expect(() => loadEnv({ GITHUB_API_BASE_URL: 'bad-url' })).toThrow();
    expect(() => loadEnv({ PORT: '70000' })).toThrow();
    expect(() => loadEnv({ SEARCH_DEFAULT_PER_PAGE: '0' })).toThrow();
    expect(() => loadEnv({ SEARCH_DEFAULT_PER_PAGE: '50', SEARCH_MAX_PER_PAGE: '10' })).toThrow();
  });
});