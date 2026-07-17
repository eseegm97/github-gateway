export type AppEnv = {
  githubToken: string;
  githubApiBaseUrl: string;
  mongodbUri: string;
  port: number;
  corsOrigin: string;
};

const DEFAULT_GITHUB_API_BASE_URL = 'https://api.github.com';
const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/github-gateway';
const DEFAULT_PORT = 4000;
const DEFAULT_CORS_ORIGIN = 'http://localhost:4200';

type EnvSource = Record<string, string | undefined>;

function parsePort(value?: string): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error('Invalid PORT value. Expected an integer between 1 and 65535.');
  }

  return parsed;
}

function assertValidUrl(value: string, variableName: string): string {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`Invalid ${variableName} value. Expected a valid absolute URL.`);
  }
}

function getDefaultEnvSource(): EnvSource {
  const withProcess = globalThis as { process?: { env?: EnvSource } };
  return withProcess.process?.env ?? {};
}

export function loadEnv(source: EnvSource = getDefaultEnvSource()): AppEnv {
  return {
    githubToken: source['GITHUB_TOKEN'] ?? '',
    githubApiBaseUrl: assertValidUrl(
      source['GITHUB_API_BASE_URL'] ?? DEFAULT_GITHUB_API_BASE_URL,
      'GITHUB_API_BASE_URL',
    ),
    mongodbUri: source['MONGODB_URI'] ?? DEFAULT_MONGODB_URI,
    port: parsePort(source['PORT']),
    corsOrigin: assertValidUrl(source['CORS_ORIGIN'] ?? DEFAULT_CORS_ORIGIN, 'CORS_ORIGIN'),
  };
}

export const env = loadEnv();