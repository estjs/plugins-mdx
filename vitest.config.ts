import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
const dirname = resolve();
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve(dirname, 'src')}/`,
    },
  },
  define: {
    __DEV__: true,
  },
  test: {
    coverage: {
      provider: 'c8',
      exclude: ['playground/**/*'],
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
    watch: false
  },
});
