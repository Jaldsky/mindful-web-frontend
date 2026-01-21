import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserIdGenerator } from '../../../src/contexts/user/UserIdGenerator';

describe('UserIdGenerator', () => {
  let generator: UserIdGenerator;

  beforeEach(() => {
    generator = new UserIdGenerator();
  });

  describe('generateId', () => {
    it('generates a valid UUID', () => {
      const id = generator.generateId();
      
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });

    it('generates unique IDs', () => {
      const id1 = generator.generateId();
      const id2 = generator.generateId();
      const id3 = generator.generateId();
      
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('generates IDs of consistent length', () => {
      const id1 = generator.generateId();
      const id2 = generator.generateId();
      
      expect(id1.length).toBe(36); // UUID length with hyphens
      expect(id2.length).toBe(36);
    });

    it('generates IDs with hyphens at correct positions', () => {
      const id = generator.generateId();
      
      expect(id[8]).toBe('-');
      expect(id[13]).toBe('-');
      expect(id[18]).toBe('-');
      expect(id[23]).toBe('-');
    });

    it('uses crypto.randomUUID', () => {
      const cryptoSpy = vi.spyOn(crypto, 'randomUUID');
      
      generator.generateId();
      
      expect(cryptoSpy).toHaveBeenCalled();
      
      cryptoSpy.mockRestore();
    });

    it('generates different IDs on multiple calls', () => {
      const ids = new Set<string>();
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        ids.add(generator.generateId());
      }
      
      expect(ids.size).toBe(iterations);
    });

    it('returns a string', () => {
      const id = generator.generateId();
      
      expect(typeof id).toBe('string');
    });

    it('generates lowercase hexadecimal characters', () => {
      const id = generator.generateId();
      const withoutHyphens = id.replace(/-/g, '');
      
      expect(withoutHyphens).toMatch(/^[0-9a-f]+$/i);
    });
  });
});
