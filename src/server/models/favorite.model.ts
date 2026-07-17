export type FavoriteProfile = {
  id: string;
  username: string;
  notes: string;
  tags: string[];
  avatarUrl?: string;
  profileUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpsertFavoritePayload = {
  username: string;
  notes?: string;
  tags?: string[];
  avatarUrl?: string;
  profileUrl?: string;
};