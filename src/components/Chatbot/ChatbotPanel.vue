<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ChatbotMessage from '@/components/Chatbot/ChatbotMessage.vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/home'

const store = useChatStore()
const { inputMessage, messageHistory, isLoading, currentStatus, predictResult } = storeToRefs(store)
const { sendMessage, handleStartPredict, exportResult } = store

const textarea = ref<HTMLTextAreaElement | null>(null)

const adjustTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const onSubmit = () => {
  console.log(`send message: [${inputMessage.value}]`)
  // trim message
  const trimmedMessage = inputMessage.value?.trim()
  if (!trimmedMessage) {
    alert('Message cannot be empty')
    return
  }
  // submit form
  sendMessage(trimmedMessage)
  // submit complete
  inputMessage.value = ''
  // handle resize event
  nextTick(adjustTextarea)
}
</script>

<template>
  <div class="h-full bg-white rounded-lg shadow flex flex-col">
    <div
      class="px-4 py-4 border-b bg-white rounded-t-lg w-full flex align-center justify-between h-fit"
    >
      <div>
        <!-- text content -->
        <span class="font-bold">Le 姐家事協商好夥伴</span>
        <div class="text-gray-400 text-xs">
          請使用者以家事調解員的身分來使用，儘量公允地提供父母雙方相關資訊
        </div>
      </div>
      <div class="flex align-center no-wrap">
        <slot name="info-area"> </slot>
        <button type="button">
          <!-- download button -->
          <img
            src="@/assets/download-icon.svg"
            alt="download-icon"
            class="h-8"
            @click="exportResult"
          />
        </button>
      </div>
    </div>
    <div class="flex flex-col w-full grow bg-orange-50 rounded-b-lg overflow-hidden">
      <div class="grow overflow-auto">
        <!-- content -->
        <ChatbotMessage
          v-for="(msgObj, index) in messageHistory?.filter((msgObj) => msgObj.role !== 'system')"
          :key="index"
          :message="msgObj"
          :predictResult="msgObj.status === 'predict' ? predictResult : undefined"
        ></ChatbotMessage>
      </div>
      <form class="w-full" @submit.prevent="onSubmit">
        <div class="w-full flex justify-center mb-6">
          <!-- actions container -->
          <button
            v-if="currentStatus === 'initial'"
            class="border border-slate-200 rounded-xl px-2 py-2 bg-white shadow hover:bg-slate-50"
            @click="inputMessage = '好！'"
          >
            好，我準備開始對話了！
          </button>

          <div v-if="currentStatus === 'summary'">
            <span class="text-slate-600 text-sm">如果不需修改，請點擊按鈕：</span>
            <button
              class="border border-slate-200 rounded-xl px-2 py-2 bg-white shadow hover:bg-slate-50"
              @click="handleStartPredict"
              type="button"
            >
              開始預測判決結果！
            </button>
          </div>
        </div>
        <label for="chat" class="sr-only">Your message</label>
        <div
          class="flex items-center mx-3 my-3 md:mx-6 md:mb-6 px-3 py-2 border rounded-xl bg-white overflow-hidden focus-within:border-slate-300 focus-within:shadow"
        >
          <textarea
            id="chat"
            rows="1"
            ref="textarea"
            class="block m-0 resize-none w-full text-gray-900 bg-transparent max-h-[25dvh] max-h-52 border:none outline-none"
            placeholder="詢問Le姐..."
            @input="adjustTextarea"
            @keypress.enter.exact.prevent="onSubmit"
            v-model="inputMessage"
            :disabled="isLoading"
          ></textarea>
          <button
            type="submit"
            class="inline-flex justify-center p-2 text-orange-600 rounded-full cursor-pointer hover:bg-orange-100"
          >
            <svg
              class="w-5 h-5 rotate-90 rtl:-rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path
                d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"
              />
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
