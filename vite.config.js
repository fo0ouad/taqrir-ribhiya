import { defineConfig } from 'vite';

export default defineConfig({
  base: '/taqrir-ribhiya/', // هام جداً لعمل مسارات الأصول والملفات بشكل صحيح على GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
