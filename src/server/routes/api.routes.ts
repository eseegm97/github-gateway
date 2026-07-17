import { Router } from 'express';
import { favoritesRouter } from './favorites.routes';
import { githubRouter } from './github.routes';
import { historyRouter } from './history.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.use('/github', githubRouter);
apiRouter.use('/favorites', favoritesRouter);
apiRouter.use('/history', historyRouter);

apiRouter.all('{*splat}', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});