import { createRequire } from 'node:module'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Re-register @typescript-eslint here from eslint-config-next's own context.
// It's already a dependency of eslint-config-next (so nothing new lands in
// the lockfile), but in ESLint 9 flat config a plugin declared inside a
// `files`-scoped entry is only visible within that entry — our project
// overrides live in their own entry, so we point at the same plugin object.
const requireFromNext = createRequire(new URL('node_modules/eslint-config-next/package.json', import.meta.url))
const tsEslint = await import(requireFromNext.resolve('@typescript-eslint/eslint-plugin'))

export default defineConfig([
  // Official Next.js flat config (includes TypeScript, React, core-web-vitals)
  ...nextVitals,

  // Ignore build output and generated files
  globalIgnores(['.next/**', 'node_modules/**', 'sanity/types.ts']),

  // Project-specific overrides
  {
    plugins: { '@typescript-eslint': tsEslint.default ?? tsEslint },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      // React Compiler-era rule (eslint-plugin-react-hooks v7, bundled with
      // eslint-config-next 16). Without the React Compiler enabled it also
      // flags the common "sync with an external system" effect shapes this
      // site uses (localStorage/sessionStorage hydration, fetch-on-mount),
      // which are safe and idiomatic. Keep the signal, don't block on it.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
