<script setup lang="ts">
import BasicLayout from '@/components/BasicLayout.vue'
import TaiwanMap from '@/components/charts/TaiwanMap.vue'
import resources from '@/assets/resource-by-city.json'
import { reactive } from 'vue'

interface City {
  name: string
  status: boolean
}

const cities = reactive<City[]>(
  Object.keys(resources).map((city) => ({ name: city, status: false }))
)
const selectedResources = reactive({
  政府部門: [],
  法律議題: [],
  家庭諮商: [],
  家庭扶助: [],
  親職教育: [],
  兒少照顧: [],
  心理健康: [],
  多元族群: []
})

const toggleCity = (cityName: string) => {
  cities.forEach((city, index, cities) => {
    cities[index].status = false
    if (city.name === cityName) cities[index].status = true
  })

  // TODO: fix typescript issue later
  const cityResources = resources[cityName] || {}
  Object.keys(selectedResources).forEach((category) => {
    selectedResources[category] = []
    if (cityResources[category]) {
      selectedResources[category] = cityResources[category]
    }
  })
}
</script>

<template>
  <BasicLayout>
    <h1 class="text-4xl font-bold mb-2">友善資源</h1>
    <div class="mb-8 flex mt-6 pt-3 pb-3 px-4 rounded-xl bg-slate-100">
      使用說明：本網頁蒐集國內各縣市中，親權裁判當事人所可能會需要使用或參考的社會服務資源。請先從左方地圖上點選所要查詢的縣市，右方即會呈現該縣市目前相關資源之網頁連結。使用者可以直接點入即連結到該機構的網頁，進一步查詢相關資訊。
    </div>
    <div class="md:flex md:gap-6">
      <div class="md:basis-1/2">
        <div class="grid grid-cols-5">
          <button
            class="text-xs px-2 py-1 rounded-xl md:px-4 md:py-2 m-1 md:text-sm block"
            :class="city.status ? 'text-white bg-orange-800' : 'bg-orange-100 text-orange-800'"
            v-for="(city, index) in cities"
            :key="index"
            @click="toggleCity(city.name)"
          >
            {{ city.name }}
          </button>
        </div>
        <TaiwanMap class="grow" :cities="cities"></TaiwanMap>
      </div>
      <div class="mt-6 md:mt-0 md:basis-1/2">
        <div>
          本網頁目前包含的資源包括以下8大類：
          (1)政府部門、(2)法律議題、(3)家庭諮商、(4)家庭扶助、(5)親職教育、(6)兒少照顧、(7)心理健康、(8)
          多元族群。
        </div>
        <div class="bg-slate-50 px-4 py-4 rounded-xl my-4">
          <div
            v-for="(category, i) in Object.keys(selectedResources)"
            :key="category"
            :class="i !== Object.keys(selectedResources).length - 1 ? 'mb-2' : ''"
          >
            <span class="font-semibold">({{ i + 1 }}){{ category }}:</span>
            <span v-if="selectedResources[category].length == 0"> 無</span>
            <div v-else>
              <span v-for="(link, i) in selectedResources[category]" :key="i">
                <a :href="link.link" target="_blank" class="hover:underline text-sky-500">{{
                  link.name
                }}</a>
                <span v-if="i < selectedResources[category].length - 1">、</span>
              </span>
            </div>
          </div>
        </div>
        <div class="text-sm italic">
          感謝育達科技大學社會工作系施睿誼教授
          (現任臺灣司法社工學會秘書長)提供本網頁的相關專業資訊。
        </div>
      </div>
    </div>
  </BasicLayout>
</template>
