import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const esm = {
  input: 'src/esm/main.js',
  output: {
    file: 'dist/esm/bundle.js',
    format: 'es',
    name: 'Banner'
  },
  plugins: [
    resolve(),
    commonjs(),
    svelte({
      include: 'src/components/**/*.svelte'
    })
  ]
}

const browser = {
  input: 'src/browser/main.js',
  output: {
    file: 'dist/browser/bundle.js',
    format: 'iife',
    name: 'Banner'
  },
  plugins: [
    resolve(),
    commonjs(),
    svelte({
      include: 'src/components/**/*.svelte'
    })
  ]
}

export default [
  esm,
  browser
]