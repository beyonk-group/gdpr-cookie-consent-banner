import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  envPrefix: 'PUBLIC_',
  resolve: {
    alias: {
      $lib: './src/lib'
    }
  },
  plugins: [
    svelte({
      include: /\.svelte$/,
      compilerOptions: {
        customElement: true
      }
    })
  ],
  build: {
    target: 'modules',
    outDir: 'dist',
    lib: {
      entry: 'src/lib/index.js',
      fileName: 'index',
      name: 'lib'
    }
  }
})
