export const FAVORITE_NOTE_MAX_LENGTH = 500;

export type Favorite = {
  id: string;
  githubId: number;
  login: string;
  avatarUrl: string;
  profileUrl: string;
  note: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};