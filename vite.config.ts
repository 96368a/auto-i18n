import path from 'node:path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    UnoCSS(),
    solidPlugin(),
    Pages(),
    AutoImport({
      imports: [
        'solid-js',
      ],
      dts: true,
      dirs: [
        'src/primitives',
      ],
      packagePresets: ['@solidjs/router', '@solid-primitives/storage'],
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
