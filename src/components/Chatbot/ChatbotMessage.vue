<template>
  <div
    class="w-full flex p-3"
    :class="message.role === 'assistant' ? 'justify-start' : 'justify-end'"
  >
    <img
      v-if="message.role === 'assistant'"
      class="h-10 rounded-full mr-3"
      src="@/assets/assistant-avatar.png"
      alt="assistant-avatar"
    />
    <div
      class="rounded-3xl px-5 py-2.5"
      :class="message.role === 'assistant' ? 'bg-white' : 'bg-amber-200 max-w-[70%]'"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
        v-if="message.status === 'predict' && message.role === 'assistant' && predictResult"
      >
        <ViolinPlot :predict_result="predictResult" model_used="S1"></ViolinPlot>
        <ViolinPlot :predict_result="predictResult" model_used="S2"></ViolinPlot>
      </div>
      <MarkdownRenderer :source="message.content"></MarkdownRenderer>
      <!-- {{ message.content }} -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/models/chatModels'
import type { PredictResponse } from '@/models/predictModels'
import ViolinPlot from '@/components/charts/ViolinPlot.vue'
import MarkdownRenderer from '@/components/Chatbot/MarkdownRenderer.vue'
defineProps<{
  message: Message
  predictResult?: PredictResponse
}>()
</script>

<style scoped></style>
