import { describe, expect, it } from 'vitest';
import { compareVersionLabelsNewestFirst } from '../app/services/versionService';

describe('compareVersionLabelsNewestFirst', () => {
  it('orders release lines numerically, newest first', () => {
    expect(['v1.9', 'v0.117', 'v1.10', 'v1.0'].sort(compareVersionLabelsNewestFirst))
      .toEqual(['v1.10', 'v1.9', 'v1.0', 'v0.117']);
  });
});
