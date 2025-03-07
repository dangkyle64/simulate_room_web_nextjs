import { describe, it, expect } from 'vitest';

// Simple addition function
function sum(a, b) {
  return a + b;
}

// Basic test suite to confirm Vitest setup
describe('Basic Math Tests', () => {
  it('should correctly add 2 + 2', () => {
    const result = sum(2, 2);
    expect(result).toBe(4);  // Verify that 2 + 2 equals 4
  });
});
