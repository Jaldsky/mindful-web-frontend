import { describe, it, expect } from 'vitest';
import { decodeJwtPayload, extractUserIdFromToken } from '../../../src/utils/functions/jwtUtils';

describe('jwtUtils', () => {
  describe('decodeJwtPayload', () => {
    it('decodes valid JWT token', () => {
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access', sub: 'user-123' }));
      const token = `${header}.${payload}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual({ type: 'access', sub: 'user-123' });
    });

    it('returns null for invalid token format', () => {
      expect(decodeJwtPayload('invalid-token')).toBeNull();
      expect(decodeJwtPayload('only-one-part')).toBeNull();
      expect(decodeJwtPayload('two.parts')).toBeNull();
    });

    it('returns null for invalid base64 payload', () => {
      const token = 'header.invalid-base64!.signature';
      expect(decodeJwtPayload(token)).toBeNull();
    });

    it('handles payload without padding', () => {
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access', sub: 'user-1' })).replace(/=+$/, '');
      const token = `${header}.${payload}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual({ type: 'access', sub: 'user-1' });
    });

    it('handles payload with special characters', () => {
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access', sub: 'user-with-dash_123' }));
      const token = `${header}.${payload}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual({ type: 'access', sub: 'user-with-dash_123' });
    });
  });

  describe('extractUserIdFromToken', () => {
    it('extracts user_id from valid access token', () => {
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access', sub: 'user-123' }));
      const token = `${header}.${payload}.signature`;

      const result = extractUserIdFromToken(token);

      expect(result).toBe('user-123');
    });

    it('returns null for null token', () => {
      expect(extractUserIdFromToken(null)).toBeNull();
    });

    it('returns null for invalid token', () => {
      expect(extractUserIdFromToken('invalid-token')).toBeNull();
    });

    it('returns null for non-access token', () => {
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'refresh', sub: 'user-123' }));
      const token = `${header}.${payload}.signature`;

      const result = extractUserIdFromToken(token);

      expect(result).toBeNull();
    });

    it('returns null for token without sub field', () => {
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access' }));
      const token = `${header}.${payload}.signature`;

      const result = extractUserIdFromToken(token);

      expect(result).toBeNull();
    });

    it('returns null for token with non-string sub', () => {
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access', sub: 123 }));
      const token = `${header}.${payload}.signature`;

      const result = extractUserIdFromToken(token);

      expect(result).toBeNull();
    });

    it('handles UUID format user_id', () => {
      const userId = '8c286206-d75c-4db8-b587-8ca06187bea1';
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access', sub: userId }));
      const token = `${header}.${payload}.signature`;

      const result = extractUserIdFromToken(token);

      expect(result).toBe(userId);
    });
  });
});
