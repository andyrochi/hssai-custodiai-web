<template>
  <div v-html="markdown.render(source)"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import markdownItClass from 'markdown-it-class'

const markdown = new MarkdownIt().use(markdownItClass, {
  h1: ['text-2xl', 'font-bold', 'my-2.5'],
  h2: ['text-xl', 'font-bold', 'my-2.5'],
  h3: ['text-lg', 'font-bold', 'my-2.5'],
  h4: ['text-base', 'font-bold', 'my-2.5'],
  h5: ['text-base', 'font-bold', 'my-2.5'],
  h6: ['text-base', 'font-bold', 'my-2.5'],
  img: ['mx-auto', 'rounded-lg'],
  p: ['text-base'],
  a: ['hover:underline', 'text-sky-500'],
  ul: ['list-outside', 'list-disc', 'ps-5'],
  ol: ['list-outside', 'list-decimal', 'ps-5'],
  table: ['table-auto', 'border-collapse', 'w-full', 'rounded-lg', 'border'],
  th: ['font-bold', 'text-slate-600', 'border-b', 'px-1.5', 'py-3', 'bg-slate-100'],
  td: ['border', 'border-slate-200', 'px-1.5', 'py-3']
})

defineProps({
  source: {
    type: String,
    default: ''
  }
})
</script>
