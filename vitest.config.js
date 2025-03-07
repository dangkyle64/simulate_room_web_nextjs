// vitest.config.js or vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',  // Ensure that jsdom is used for browser-like environment
    globals: true,         // Optional: Make global variables like `vi` available
    setupFiles: './vitest.setup.js', // Path to a setup file if you have one
  },
});
