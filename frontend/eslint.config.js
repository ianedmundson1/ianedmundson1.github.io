import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { ignores: ['dist'] },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...js.configs.recommended,
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    ...reactHooks.configs['recommended-latest'],
    ...reactRefresh.configs.vite,
    ...jsxA11y.flatConfigs.recommended,

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: { react: { version: '19' } },
  },
])
