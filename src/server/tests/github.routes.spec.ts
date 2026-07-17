import { describe, expect, it } from 'vitest';
import { sortExactFirst } from '../routes/github.routes';

describe('sortExactFirst', () => {
  it('prioritizes exact username matches then alphabetic fallback', () => {
    const result = sortExactFirst(
      [
        { username: 'other-user', avatarUrl: '1', profileUrl: '1' },
        { username: 'ExactUser', avatarUrl: '2', profileUrl: '2' },
        { username: 'another-user', avatarUrl: '3', profileUrl: '3' },
      ],
      'exactuser',
    );

    expect(result.map((item) => item.username)).toEqual([
      'ExactUser',
      'another-user',
      'other-user',
    ]);
  });
});