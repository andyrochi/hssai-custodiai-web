<script setup lang="ts">
import intro from '@/content/Home/intro.md'
import hint from '@/content/Home/hint.md'
import ChatbotPanel from '@/components/Chatbot/ChatbotPanel.vue'
</script>

<template>
  <div class="w-[92vw] max-w-screen-2xl mx-auto flex h-full">
    <div class="md:basis-1/2 h-full px-8 pt-8 pb-16 rounded-lg bg-white shadow overflow-auto">
      <intro></intro>
      <div class="mt-6 pt-6 pb-3 px-4 rounded-xl bg-slate-100">
        <hint></hint>
      </div>
    </div>
    <div class="md:basis-1/2"><ChatbotPanel></ChatbotPanel></div>
  </div>
</template>
