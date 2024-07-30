// Typescript shim, see https://github.com/unplugin/unplugin-vue-markdown?tab=readme-ov-file#typescript-shim
declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}

// Declaration for markdown-it-class
declare module 'markdown-it-class'

// Declaration for pdfmake
declare module 'pdfmake'

// Declaration for plotly
declare module 'plotly.js-dist-min'

declare module 'd3'

declare module 'opencc-js'
