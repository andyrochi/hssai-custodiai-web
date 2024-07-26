<script setup lang="ts">
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
const showModel = ref(false)
const textDescription = defineModel<string>({ required: true })

interface DescriptionItem {
  label: string
  value: string
}

interface DescriptionType {
  type: string
  item: DescriptionItem[]
}

defineProps<{
  dialogTitle: string
  descriptionList: DescriptionType[]
  invalid?: boolean | undefined
}>()
</script>
<template>
  <div class="bg-slate-100 rounded-xl px-2">
    <div class="flex justify-between gap-1">
      <button
        @click="showModel = true"
        class="bg-slate-50 rounded-xl border px-2 py-2 text-sm my-1 hover:bg-slate-100"
      >
        查看範例文字
      </button>
      <button
        @click="textDescription = ''"
        class="bg-red-50 rounded-xl text-red-800 border px-2 py-2 text-sm my-1 hover:bg-red-100"
      >
        清除文字
      </button>
    </div>
    <Textarea
      v-model="textDescription"
      rows="4"
      class="resize-none w-full"
      placeholder="可直接輸入描述，或由範例文字開始編輯..."
      :invalid="invalid"
    ></Textarea>
    <Dialog
      v-model:visible="showModel"
      modal
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="">
          <div class="text-xl">{{ dialogTitle }}</div>
          <div class="text-sm text-slate-400">選擇符合的描述，匯入並加以編輯。</div>
        </div>
      </template>
      <div>
        <div v-for="(descriptions, index) in descriptionList" :key="index">
          <div class="mb-3">
            <div class="font-bold text-gray-600 mb-2">{{ descriptions.type }}</div>
            <div
              class="mb-2 border rounded-lg px-4 py-2 hover:shadow focus-within:shadow"
              v-for="(item, index) in descriptions['item']"
              :key="index"
            >
              <div>{{ item.label }}</div>
              <div class="flex justify-end w-full">
                <button
                  @click="textDescription += item.value"
                  :disabled="textDescription.indexOf(item.value) >= 0"
                  class="text-nowrap bg-orange-100 text-orange-800 rounded px-2 py-1 hover:bg-orange-50 focus:outline-none focus:ring-orange-50 focus:ring-4 active:bg-orange-200 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  匯入文字
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
