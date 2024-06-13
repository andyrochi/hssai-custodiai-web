<script setup lang="ts">
import ModeLayout from '@/components/ModeLayout.vue'
import instructions from '@/content/Mode2/mode2_instructions.md'
import { ref } from 'vue'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const fatherFavorableText = ref('')
const fatherFavorableVisible = ref(false)
const fatherUnfavorableText = ref('')
const fatherUnfavorableVisible = ref(false)
const motherFavorableText = ref('')
const motherFavorableVisible = ref(false)
const motherUnfavorableText = ref('')
const motherUnfavorableVisible = ref(false)
</script>

<template>
  <ModeLayout title="模式二：文字輸入" modeType="理由文字">
    <template #instructions>
      <instructions></instructions>
    </template>
    <template #fatherFavorable>
      <div class="flex gap-2">
        <Textarea v-model="fatherFavorableText" rows="4" class="resize-none w-full"></Textarea>
        <Button label="新增範例文字" @click="fatherFavorableVisible = true" />
      </div>
      <Dialog
        v-model:visible="fatherFavorableVisible"
        modal
        header="範例文字"
        :style="{ width: '25rem' }"
      >
      </Dialog>
    </template>
    <template #fatherUnfavorable>
      <div class="flex gap-2">
        <Textarea v-model="fatherUnfavorableText" rows="4" class="resize-none w-full"></Textarea>
        <Button label="新增範例文字" @click="fatherUnfavorableVisible = true" />
      </div>
      <Dialog
        v-model:visible="fatherUnfavorableVisible"
        modal
        header="範例文字"
        :style="{ width: '25rem' }"
      >
      </Dialog>
    </template>
    <template #motherFavorable>
      <div class="flex gap-2">
        <Textarea v-model="motherFavorableText" rows="4" class="resize-none w-full"></Textarea>
        <Button label="新增範例文字" @click="motherFavorableVisible = true" />
      </div>
      <Dialog
        v-model:visible="motherFavorableVisible"
        modal
        header="範例文字"
        :style="{ width: '25rem' }"
      >
      </Dialog>
    </template>
    <template #motherUnfavorable>
      <div class="flex gap-2">
        <Textarea v-model="motherUnfavorableText" rows="4" class="resize-none w-full"></Textarea>
        <Button label="新增範例文字" @click="motherUnfavorableVisible = true" />
      </div>
      <Dialog
        v-model:visible="motherUnfavorableVisible"
        modal
        header="範例文字"
        :style="{ width: '25rem' }"
      >
      </Dialog>
    </template>
    <template #note>
      <div class="text-sm text-gray-700 mt-3">
        提醒：本系統目前提供兩種AI模型預測，若結果差異過大可能代表此個案不容易有效預測，請再嘗試提供更細緻的描述，重新預測。兩個模型的原理與比較請見<RouterLink
          to="/technical-guide"
          class="text-blue-300 hover:underline"
          >技術說明</RouterLink
        >。
      </div>
    </template>
  </ModeLayout>
</template>
