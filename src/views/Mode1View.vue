<script setup lang="ts">
import BasicLayout from '@/components/BasicLayout.vue'
import instructions from '@/content/Mode1/mode1_instructions.md'
</script>

<template>
  <BasicLayout>
    <h1 class="text-2xl font-bold">模式一：選項輸入</h1>
    <div class="flex mt-6 pt-6 pb-3 px-4 rounded-xl bg-slate-100">
      <instructions></instructions>
    </div>
  </BasicLayout>
</template>
