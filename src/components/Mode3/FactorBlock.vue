<template>
  <div class="mb-3 bg-slate-100 rounded-xl px-2 py-1">
    <div class="flex justify-begin items-center flex-wrap gap-1 mb-2">
      <div class="w-full text-center text-slate-600 font-bold text-sm relative">
        因素與理由 {{ index + 1 }}
        <button
          class="absolute right-0 top-0 rounded-full outline-none focus:ring-2 focus:ring-orange-200"
          @click="factorsList?.splice(index, 1)"
        >
          <img src="@/assets/x-mark.svg" class="h-6" />
        </button>
      </div>
      <Dropdown
        v-model="factor['factor']"
        :options="factorsSource"
        optionLabel="label"
        optionValue="value"
        placeholder="選擇因素"
        class="w-full text-sm md:w-[14rem] rounded-xl"
        :class="invalidFactor ? 'border !border-red-500' : ''"
        :invalid="invalidFactor"
      >
        <template #option="slotProps">
          <div>
            <div class="font-bold">{{ slotProps.option.label }}</div>
            <div class="text-xs text-gray-400 text-wrap">
              {{ slotProps.option.desc }}
            </div>
          </div>
        </template>
      </Dropdown>
      <button
        class="bg-slate-50 rounded-xl border px-2 py-2 text-sm my-1 hover:bg-slate-100"
        @click="setModal()"
      >
        查看範例文字
      </button>
      <button
        @click="factor['description'] = ''"
        class="bg-red-50 rounded-xl text-red-800 border px-2 py-2 text-sm my-1 hover:bg-red-100"
      >
        清除文字
      </button>
    </div>
    <Textarea
      v-model="factor['description']"
      rows="4"
      class="resize-none w-full"
      placeholder="可直接輸入理由描述，或匯入範例文字開始編輯..."
      :invalid="validate && factor['description'].trim() === ''"
    ></Textarea>
    <InlineMessage severity="error" v-if="invalidFactor || invalidDescription" class="w-full">{{
      invalidText
    }}</InlineMessage>
  </div>
</template>

<script setup lang="ts">
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import InlineMessage from 'primevue/inlinemessage'
import { computed } from 'vue'

interface factorObj {
  factor: string | undefined
  description: string
}

interface factorSourceObj {
  label: string
  value: string
  desc: string
}

const factor = defineModel<factorObj>('factor', { required: true })
const factorsList = defineModel<factorObj[]>('factorsList', { required: true })

const props = defineProps<{
  index: number
  factorsSource: factorSourceObj[]
  setModal: Function
  validate: boolean
}>()

const invalidFactor = computed(() => props.validate && factor.value.factor === undefined)
const invalidDescription = computed(() => props.validate && factor.value.description.trim() === '')
const invalidText = computed(() => {
  let text = ''
  if (invalidFactor.value) {
    text += '因素'
  }
  if (invalidDescription.value) {
    text += invalidFactor.value ? '與' : ''
    text += '理由描述'
  }
  text += '不得為空！'
  return text
})
</script>
