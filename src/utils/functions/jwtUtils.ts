/**
 * JWT Utilities
 * Helper functions for working with JWT tokens
 */

/**
 * Decodes a JWT token without verification (for extracting payload data only)
 * @param token - JWT token string
 * @returns Decoded payload object or null if invalid
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Extracts user_id from an access token
 * @param token - JWT access token
 * @returns User ID string or null if not found/invalid
 */
export function extractUserIdFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  if (payload.type !== 'access') {
    return null;
  }

  const sub = payload.sub;
  if (typeof sub === 'string') {
    return sub;
  }

  return null;
}
