<script setup lang="ts">
import intro from '@/content/Home/intro.md'
import hint from '@/content/Home/hint.md'
import ChatbotPanel from '@/components/Chatbot/ChatbotPanel.vue'
import { ref } from 'vue'

const showIntro = ref<Boolean>(true)

const toggleIntro = () => {
  showIntro.value = !showIntro.value
}
</script>

<template>
  <div class="w-[92vw] max-w-screen-2xl mx-auto flex h-full">
    <div
      :class="
        showIntro
          ? 'md:block md:basis-1/2 h-full px-8 pt-8 pb-8 rounded-lg bg-white shadow overflow-auto md:mr-1.5'
          : 'hidden md:basis-1/2 h-full px-8 pt-8 pb-8 rounded-lg bg-white shadow overflow-auto md:mr-1.5'
      "
    >
      <intro></intro>
      <div class="mt-6 pt-6 pb-3 px-4 rounded-xl bg-slate-100">
        <hint></hint>
      </div>
      <div class="w-full">
        <button
          @click="toggleIntro"
          class="mt-4 bg-orange-100 px-4 py-2 rounded-lg text-orange-800 block mx-auto hover:bg-orange-50"
        >
          關閉說明
        </button>
      </div>
    </div>
    <div :class="showIntro ? 'hidden md:block md:basis-1/2 md:ml-1.5' : 'md:block md:ml-1.5'">
      <ChatbotPanel>
        <template #info-area>
          <button @click="toggleIntro">
            <img src="@/assets/info-icon.svg" class="h-8" />
          </button>
        </template>
      </ChatbotPanel>
    </div>
  </div>
</template>
