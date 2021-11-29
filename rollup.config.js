import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'

const plugins = [
  resolve(),
  commonjs(),
  svelte({
    include: 'src/components/**/*.svelte'
  })
]

const esm = {
  input: 'src/esm/main.js',
  output: {
    file: 'dist/esm/bundle.js',
    format: 'es',
    name: 'Banner'
  },
  plugins
}

const browser = {
  input: 'src/browser/main.js',
  output: {
    file: 'dist/browser/bundle.js',
    format: 'iife',
    name: 'Banner'
  },
  plugins
}

const browserMin = {
  input: 'src/browser/main.js',
  output: {
    file: 'dist/browser/bundle.min.js',
    format: 'iife',
    name: 'Banner'
  },
  plugins: [].concat(plugins, [ terser() ])
}

const styles = {
  input: 'src/style.scss',
  output: {
    file: '/tmp/nullfile'
  },
  plugins: [
    scss()
  ]
}

export default [ esm, browser, browserMin, styles ]
