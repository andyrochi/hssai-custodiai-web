<script setup lang="ts">
import ModeLayout from '@/components/ModeLayout.vue'
import instructions from '@/content/Mode3/mode3_instructions.md'
</script>

<template>
  <ModeLayout title="模式三：選項加文字輸入" modeType="因素與理由">
    <template #instructions>
      <instructions></instructions>
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
