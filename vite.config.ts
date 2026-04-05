import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Resolves figma:asset/ imports to a 1x1 transparent placeholder PNG
function figmaAssetPlaceholder(): Plugin {
  return {
    name: 'figma-asset-placeholder',
    resolveId(source) {
      if (source.startsWith('figma:asset/')) {
        return `\0${source}`
      }
    },
    load(id) {
      if (id.startsWith('\0figma:asset/')) {
        // 1x1 transparent PNG as data URL
        return `export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIABQABNjN9GQAAAAlFTkSuQmCC"`
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetPlaceholder(),
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
