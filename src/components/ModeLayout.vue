<script setup lang="ts">
import BasicLayout from '@/components/BasicLayout.vue'

defineProps<{
  title: string
  modeType: string | null
}>()
</script>

<template>
  <BasicLayout>
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <div class="flex mt-6 pt-6 pb-3 px-4 rounded-xl bg-slate-100">
      <slot name="instructions"></slot>
    </div>
    <div class="md:grid md:grid-cols-2 mt-6">
      <div class="pb-4 mb-4 border-b md:pb-0 md:mb-0 md:border-r md:border-b-0 md:px-3">
        <div>
          <h2 class="text-xl">
            對父親<span class="text-green-800 font-bold">有利</span>的{{ modeType }}
          </h2>
          <div>
            <slot name="fatherFavorable"></slot>
          </div>
        </div>
        <div class="mt-3">
          <h2 class="text-xl">
            對父親<span class="text-red-800 font-bold">不利</span>的{{ modeType }}
          </h2>
          <div>
            <slot name="fatherUnfavorable"></slot>
          </div>
        </div>
      </div>
      <div class="md:px-3">
        <div>
          <h2 class="text-xl">
            對母親<span class="text-green-800 font-bold">有利</span>的{{ modeType }}
          </h2>
          <div>
            <slot name="motherFavorable"></slot>
          </div>
        </div>
        <div class="mt-3">
          <h2 class="text-xl">
            對母親<span class="text-red-800 font-bold">不利</span>的{{ modeType }}
          </h2>
          <div>
            <slot name="motherUnfavorable"></slot>
          </div>
        </div>
      </div>
    </div>

    <div class="text-sm text-gray-700 mt-3">
      <slot name="note"></slot>
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

<style scoped></style>
