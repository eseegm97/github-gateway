import { Router } from 'express';
import { FavoriteProfile, UpsertFavoritePayload } from '../models/favorite.model';

const favoritesStore = new Map<string, FavoriteProfile>();

export const favoritesRouter = Router();

favoritesRouter.get('/', (_req, res) => {
  const items = Array.from(favoritesStore.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  res.json({ data: items });
});

favoritesRouter.post('/', (req, res) => {
  const payload = req.body as UpsertFavoritePayload;
  const username = payload.username?.trim();

  if (!username) {
    res.status(400).json({ error: 'username is required.' });
    return;
  }

  const now = new Date().toISOString();
  const created: FavoriteProfile = {
    id: username.toLowerCase(),
    username,
    notes: payload.notes ?? '',
    tags: payload.tags ?? [],
    avatarUrl: payload.avatarUrl,
    profileUrl: payload.profileUrl,
    createdAt: now,
    updatedAt: now,
  };

  favoritesStore.set(created.id, created);
  res.status(201).json({ data: created });
});

favoritesRouter.put('/:id', (req, res) => {
  const idParam = req.params['id'];
  const id = (Array.isArray(idParam) ? idParam[0] : idParam)?.toLowerCase();

  if (!id) {
    res.status(400).json({ error: 'Favorite id is required.' });
    return;
  }

  const current = favoritesStore.get(id);
  if (!current) {
    res.status(404).json({ error: 'Favorite was not found.' });
    return;
  }

  const payload = req.body as Partial<UpsertFavoritePayload>;
  const updated: FavoriteProfile = {
    ...current,
    notes: payload.notes ?? current.notes,
    tags: payload.tags ?? current.tags,
    avatarUrl: payload.avatarUrl ?? current.avatarUrl,
    profileUrl: payload.profileUrl ?? current.profileUrl,
    updatedAt: new Date().toISOString(),
  };

  favoritesStore.set(id, updated);
  res.json({ data: updated });
});

favoritesRouter.delete('/:id', (req, res) => {
  const idParam = req.params['id'];
  const id = (Array.isArray(idParam) ? idParam[0] : idParam)?.toLowerCase();

  if (!id) {
    res.status(400).json({ error: 'Favorite id is required.' });
    return;
  }

  const removed = favoritesStore.delete(id);
  if (!removed) {
    res.status(404).json({ error: 'Favorite was not found.' });
    return;
  }

  res.status(204).send();
});