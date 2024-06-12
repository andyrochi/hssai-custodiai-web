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
    <div class="md:columns-2 mt-6">
      <div class="mb-6 border-b md:mb-0 md:border-r md:border-b-0">
        <h2 class="text-xl">對父親<span class="text-green-800 font-bold">有利</span>的因素選項</h2>
        <h2 class="text-xl">對父親<span class="text-red-800 font-bold">不利</span>的因素選項</h2>
      </div>
      <div>
        <h2 class="text-xl">對母親<span class="text-green-800 font-bold">有利</span>的因素選項</h2>
        <h2 class="text-xl">對母親<span class="text-red-800 font-bold">不利</span>的因素選項</h2>
      </div>
    </div>
    <div class="text-sm text-gray-700 mt-3">
      提醒：本系統目前提供兩種AI模型預測，若結果差異過大可能代表此個案不容易有效預測，請再嘗試提供更細緻的描述，重新預測。兩個模型的原理與比較請見<RouterLink
        to="/technical-guide"
        class="text-blue-300 hover:underline"
        >技術說明</RouterLink
      >。
    </div>
    <div class="flex justify-center gap-3 mt-3">
      <button class="text-xl bg-red-100 px-4 py-2 rounded-lg text-red-800 block hover:bg-red-50">
        清除輸入
      </button>
      <button
        class="text-xl bg-orange-100 px-4 py-2 rounded-lg text-orange-800 block hover:bg-orange-50"
      >
        開始預測
      </button>
    </div>
  </BasicLayout>
</template>
