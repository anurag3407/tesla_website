import { describe, it, expect } from 'vitest';
import { CORE_DEVELOPERS, SAMPLE_IMAGE_PRESETS } from './DeveloperData';

describe('Developer Showcase Data & Cards', () => {
  it('contains the core maintainers and platform developers', () => {
    expect(CORE_DEVELOPERS.length).toBeGreaterThanOrEqual(3);

    const devNames = CORE_DEVELOPERS.map((d) => d.name);
    expect(devNames).toContain('Anurag Mishra');
    expect(devNames).toContain('Ehtesham Ahmad');
    expect(devNames).toContain('Manish Kumar');
  });

  it('guarantees unique developer IDs and valid HTTPS image URLs', () => {
    const ids = CORE_DEVELOPERS.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const dev of CORE_DEVELOPERS) {
      expect(dev.id).toBeTruthy();
      expect(dev.name).toBeTruthy();
      expect(dev.role).toBeTruthy();
      expect(dev.designation).toBeTruthy();
      expect(dev.department).toBeTruthy();
      expect(dev.bio).toBeTruthy();
      expect(dev.imageUrl).toMatch(/^https:\/\/.+/);
      expect(dev.contributions.length).toBeGreaterThanOrEqual(3);
      expect(dev.skills.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('verifies fallback initials match developer full names', () => {
    for (const dev of CORE_DEVELOPERS) {
      if (dev.fallbackInitials) {
        const parts = dev.name.trim().split(/\s+/);
        const expectedInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        expect(dev.fallbackInitials).toBe(expectedInitials);
      }
    }
  });

  it('verifies GitHub profile URLs and contact emails', () => {
    for (const dev of CORE_DEVELOPERS) {
      if (dev.githubUrl) {
        expect(dev.githubUrl).toMatch(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/);
      }
      if (dev.email) {
        expect(dev.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    }
  });

  it('provides valid sample image presets for the card image customizer studio', () => {
    expect(SAMPLE_IMAGE_PRESETS.length).toBeGreaterThanOrEqual(3);

    for (const preset of SAMPLE_IMAGE_PRESETS) {
      expect(preset.label).toBeTruthy();
      expect(preset.url).toMatch(/^https:\/\/.+/);
    }

    const labels = SAMPLE_IMAGE_PRESETS.map((p) => p.label);
    expect(labels.some((l) => l.includes('GitHub Avatar'))).toBe(true);
  });
});
