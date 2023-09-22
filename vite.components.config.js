import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import bundleCss from 'vite-plugin-css-injected-by-js'

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
      },
      emitCss: true
    }),
    bundleCss()
  ],
  build: {
    target: 'modules',
    outDir: 'static/v1/sdk',
    lib: {
      entry: 'src/lib/sdk/index.js',
      fileName: 'index',
      name: 'sdk'
    }
  }
})
