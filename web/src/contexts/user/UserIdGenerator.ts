/**
 * User ID Generator
 * Handles user ID generation
 * Follows Single Responsibility Principle
 */
export class UserIdGenerator {
  generateId(): string {
    return crypto.randomUUID();
  }
}

export const userIdGenerator = new UserIdGenerator();
