import { Router } from 'express';
import { env } from '../env';
import { GithubUserProfile, GithubUserSummary } from '../models/github.model';

type GithubSearchResponse = {
  items?: Array<{
    login: string;
    avatar_url: string;
    html_url: string;
  }>;
};

type GithubUserResponse = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

export function sortExactFirst(users: GithubUserSummary[], query: string): GithubUserSummary[] {
  const loweredQuery = query.toLowerCase();

  return [...users].sort((a, b) => {
    const aExact = a.username.toLowerCase() === loweredQuery ? 0 : 1;
    const bExact = b.username.toLowerCase() === loweredQuery ? 0 : 1;

    if (aExact !== bExact) {
      return aExact - bExact;
    }

    return a.username.localeCompare(b.username);
  });
}

async function githubRequest<T>(path: string): Promise<T> {
  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-gateway-app',
    'X-GitHub-Api-Version': '2022-11-28',
  });

  if (env.githubToken) {
    headers.set('Authorization', `Bearer ${env.githubToken}`);
  }

  const response = await fetch(`${env.githubApiBaseUrl}${path}`, { headers });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API request failed (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

export const githubRouter = Router();

githubRouter.get('/search', async (req, res, next) => {
  try {
    const query = `${req.query['username'] ?? ''}`.trim();

    if (!query) {
      res.json({ data: [] });
      return;
    }

    const params = new URLSearchParams({
      q: `${query} in:login`,
      per_page: '10',
    });
    const raw = await githubRequest<GithubSearchResponse>(`/search/users?${params.toString()}`);

    const users: GithubUserSummary[] = (raw.items ?? []).map((item) => ({
      username: item.login,
      avatarUrl: item.avatar_url,
      profileUrl: item.html_url,
    }));

    res.json({ data: sortExactFirst(users, query) });
  } catch (error) {
    next(error);
  }
});

githubRouter.get('/users/:username', async (req, res, next) => {
  try {
    const usernameParam = req.params['username'];
    const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;

    if (!username) {
      res.status(400).json({ error: 'Username is required.' });
      return;
    }

    const raw = await githubRequest<GithubUserResponse>(`/users/${encodeURIComponent(username)}`);
    const profile: GithubUserProfile = {
      username: raw.login,
      name: raw.name,
      avatarUrl: raw.avatar_url,
      profileUrl: raw.html_url,
      bio: raw.bio,
      company: raw.company,
      location: raw.location,
      publicRepos: raw.public_repos,
      followers: raw.followers,
      following: raw.following,
    };

    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});