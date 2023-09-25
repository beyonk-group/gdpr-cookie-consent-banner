import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  envPrefix: 'PUBLIC_',
  resolve: {
    alias: {
      '$lib': './src/lib'
    }
  },
  plugins: [
    svelte({
      exclude: /\.svelte$/,
      emitCss: false
    }),
    svelte({
      include: /\.svelte$/,
      compilerOptions: {
        customElement: true
      }
    })
  ],
  build: {
    target: 'modules',
    outDir: 'dist/v1/sdk',
    lib: {
      entry: 'src/lib/sdk/index.js',
      fileName: 'index',
      name: 'sdk'
    }
  }
})
