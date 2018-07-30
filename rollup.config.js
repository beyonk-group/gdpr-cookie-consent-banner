import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
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