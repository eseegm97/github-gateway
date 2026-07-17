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
  });

  it('throws for invalid URLs and ports', () => {
    expect(() => loadEnv({ GITHUB_API_BASE_URL: 'bad-url' })).toThrow();
    expect(() => loadEnv({ PORT: '70000' })).toThrow();
  });
});