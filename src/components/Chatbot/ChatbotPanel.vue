<script setup lang="ts">
import { ref, nextTick, reactive } from 'vue'
import ChatbotMessage from '@/components/Chatbot/ChatbotMessage.vue'

const textarea = ref<HTMLTextAreaElement | null>(null)
const message = ref<String | null>('')
// mock data
const msgHistory = reactive([
  {
    role: 'assistant',
    status: 'initial',
    content:
      '調解委員您好！我是Le姊，一個專門設計來協助處理家事調解相關問題的對話機器人。我可以使用適當的法律用語以及親權相關的法律概念，協助您逐步釐清當事人的情況，並提供親權判決結果預測與專業建議以及推薦適合當事人的的友善資源，以協助您促進雙方達成共識。當然，若在對話過程中，您的問題已超出我程式設計所涵蓋的範圍，我也會建議您直接尋求專業的法律諮詢。現在，你準備好開始對話了嗎？'
  },
  { role: 'user', status: '', content: '好' },
  {
    role: 'assistant',
    status: '',
    content:
      '首先，請您用文字描述當事人的孩子的基本情況。例如：性別、年齡、是否可以清楚表達個人意願(表達想跟哪一個當事人一起生活的意願）、孩子傾向跟誰一起生活、生活起居等等。這些基本資訊有助於我們更準確地瞭解孩子的現狀。謝謝。'
  },
  { role: 'user', status: '', content: '男 17 可以 傾向和媽媽生活 生活起居正常' }
])

const adjustTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const onSubmit = () => {
  console.log(`send message: [${message.value}]`)
  // trim message
  const trimmedMessage = message.value?.trim()
  if (!trimmedMessage) {
    alert('Message cannot be empty')
    return
  }
  // submit form
  // submit complete
  message.value = ''
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
        <span class="font-bold">Le 姊家事協商好夥伴</span>
        <div class="text-gray-400 text-xs">
          請使用者以家事調解員的身分來使用，儘量公允地提供父母雙方相關資訊
        </div>
      </div>
      <button type="button">
        <!-- download button -->
        <img src="@/assets/download-icon.svg" alt="download-icon" class="h-8" />
      </button>
    </div>
    <div class="flex flex-col w-full grow bg-orange-50 rounded-b-lg overflow-hidden">
      <div class="grow overflow-auto">
        <!-- content -->
        <ChatbotMessage
          v-for="(msgObj, index) in msgHistory"
          :key="index"
          :message="msgObj"
        ></ChatbotMessage>
      </div>
      <form class="w-full" @submit.prevent="onSubmit">
        <label for="chat" class="sr-only">Your message</label>
        <div
          class="flex items-center mx-6 mb-6 px-3 py-2 border rounded-xl bg-white overflow-hidden focus-within:border-slate-300 focus-within:shadow"
        >
          <textarea
            id="chat"
            rows="1"
            ref="textarea"
            class="block m-0 resize-none w-full text-gray-900 bg-transparent max-h-[25dvh] max-h-52 border:none outline-none"
            placeholder="詢問Le姊..."
            @input="adjustTextarea"
            @keydown.enter.exact.prevent="onSubmit"
            v-model="message"
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
