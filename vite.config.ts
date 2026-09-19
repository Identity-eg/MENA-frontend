import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

// ip3country's init() ends with `delete require.cache[...]`, which Rollup cannot
// convert and which crashes the ESM server bundle. The line only frees the parsed
// source buffer, so stripping it is safe and keeps the package bundle-compatible.
const stripIp3CountryRequireCache = {
  name: 'strip-ip3country-require-cache',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    if (!id.includes('ip3country')) return null
    return code.replace(
      /delete require\.cache\[require\.resolve\(["']\.\/ip_supalite["']\)\];?/,
      '',
    )
  },
}

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    stripIp3CountryRequireCache,
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
