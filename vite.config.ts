import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import svgr from 'vite-plugin-svgr'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    svgr({
      svgrOptions: {
        icon: false,
      },
    }),
  ],
})

export default config
