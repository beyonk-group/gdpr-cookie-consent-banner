import recommended from '@beyonk/eslint-config/recommended'
import vitest from '@beyonk/eslint-config/vitest'
import svelte from '@beyonk/eslint-config/svelte'

export default [
  ...recommended,
  ...vitest,
  ...svelte,
  {
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module'
    }
  }
]
