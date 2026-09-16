import { describe, expect, it } from 'vitest';
import { scalePercentPoint } from './useModelSegmenter.composable';

describe('scalePercentPoint', () => {
  it('converts a custom marker percentage to canvas coordinates', () => {
    expect(scalePercentPoint({ x: 25, y: 75 }, 400, 800)).toEqual({ x: 100, y: 600 });
  });
});
