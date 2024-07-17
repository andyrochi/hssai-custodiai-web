import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import markdownItClass from 'markdown-it-class'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/] // <-- allows Vue to compile Markdown files
    }),
    Markdown({
      // configure markdownIt plugins
      // see https://github.com/unplugin/unplugin-vue-markdown?tab=readme-ov-file#options
      markdownItSetup(md) {
        md.use(markdownItClass, {
          h1: ['text-2xl', 'font-bold', 'my-2.5'],
          h2: ['text-xl', 'font-bold', 'my-2.5'],
          h3: ['text-lg', 'font-bold', 'my-2.5'],
          h4: ['text-base', 'font-bold', 'my-2.5'],
          h5: ['text-base', 'font-bold', 'my-2.5'],
          h6: ['text-base', 'font-bold', 'my-2.5'],
          img: ['mx-auto', 'rounded-lg'],
          p: ['text-base', 'mb-2.5'],
          a: ['hover:underline', 'text-sky-500'],
          ul: ['list-outside', 'list-disc', 'ps-5', 'mb-4'],
          ol: ['list-decimal', 'mb-4'],
          table: ['table-auto', 'border-collapse', 'w-full', 'rounded-lg', 'border'],
          th: ['font-bold', 'text-slate-600', 'border-b', 'px-1.5', 'py-3', 'bg-slate-100'],
          td: ['border', 'border-slate-200', 'px-1.5', 'py-3']
        })
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
