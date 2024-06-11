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
      {{ message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  role: string
  status: string
  content: string
}

const props = defineProps<{
  message: Message
}>()
</script>

<style scoped></style>
