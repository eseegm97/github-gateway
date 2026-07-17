import { Router } from 'express';
import { HistoryEntry } from '../models/history.model';

const historyEntries: HistoryEntry[] = [];

export const historyRouter = Router();

historyRouter.get('/', (_req, res) => {
  const items = [...historyEntries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ data: items });
});

historyRouter.post('/', (req, res) => {
  const query = `${req.body?.query ?? ''}`.trim();

  if (!query) {
    res.status(400).json({ error: 'query is required.' });
    return;
  }

  const selectedUsername = `${req.body?.selectedUsername ?? ''}`.trim() || undefined;
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    query,
    selectedUsername,
    createdAt: new Date().toISOString(),
  };

  historyEntries.push(entry);
  res.status(201).json({ data: entry });
});

historyRouter.delete('/', (_req, res) => {
  historyEntries.length = 0;
  res.status(204).send();
});