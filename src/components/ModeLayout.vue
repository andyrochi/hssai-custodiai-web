<script setup lang="ts">
import BasicLayout from '@/components/BasicLayout.vue'

interface Props {
  title: string
  modeType: string | null
  reset?: Function
  predict?: Function
  showPredict?: boolean
}

withDefaults(defineProps<Props>(), {
  reset: () => {},
  predict: () => {},
  showPredict: false
})
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
      <button
        class="text-xl bg-red-100 px-4 py-2 rounded-lg text-red-800 block hover:bg-red-50"
        @click="
          () => {
            reset()
          }
        "
      >
        清除輸入
      </button>
      <button
        class="text-xl bg-orange-100 px-4 py-2 rounded-lg text-orange-800 block hover:bg-orange-50"
        @click="
          () => {
            predict()
          }
        "
      >
        開始預測
      </button>
    </div>

    <div class="mt-4" v-if="showPredict">
      <div>
        <h2 class="text-xl font-semibold">預測結果</h2>
        <slot name="predict-result"></slot>
        <div class="text-sm text-gray-700 mt-3 text-center">
          為了避免使用者過度解讀AI預測的結果，本系統以小提琴圖(Violin
          Plot)來呈現親權判決預測結果，展示多達100組AI預測結果的機率分布狀態。點數越密集的區域代表越有可能的機率值，小提琴圖也越寬，反之亦然。
        </div>
        <div class="text-sm text-gray-700 text-center">
          雙方共享親權的結果在不同模型可能差異較大，(*) 可參考「<RouterLink
            to="/technical-guide"
            class="text-blue-300 hover:underline"
            >技術說明</RouterLink
          >」中的「五、模型限制(以判給雙方的情形為例)」
        </div>
      </div>
    </div>
  </BasicLayout>
</template>

<style scoped></style>
