import { defineConfig } from 'vite'
import path from 'path'
import fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// 1x1 transparentes PNG — Fallback für fehlende Figma-Assets (der Make-Export
// liefert src/assets/ nicht vollständig mit). So bricht der Production-Build
// (Vercel: `vite build`) nicht ab; das Bild bleibt nur leer, bis das echte Asset da ist.
const TRANSPARENT_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

function figmaAssetResolver() {
  const warned = new Set<string>()
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        const full = path.resolve(__dirname, 'src/assets', filename)
        if (fs.existsSync(full)) return full
        // Asset fehlt → virtuelles Platzhalter-Modul statt Build-Abbruch
        if (!warned.has(filename)) {
          warned.add(filename)
          console.warn(`[figma-asset] fehlt, nutze Platzhalter: ${filename}`)
        }
        return '\0figma-missing:' + filename
      }
    },
    load(id: string) {
      if (id.startsWith('\0figma-missing:')) {
        return `export default ${JSON.stringify(TRANSPARENT_PNG)}`
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react({
      babel: {
        compact: false,
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
