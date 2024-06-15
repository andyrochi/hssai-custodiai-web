<script setup lang="ts">
import ModeLayout from '@/components/ModeLayout.vue'
import instructions from '@/content/Mode3/mode3_instructions.md'
import { ref } from 'vue'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'

interface factorObj {
  factor: string
  description: string
}

const selectedFactor = ref('')
const factorsSource = ref([
  {
    label: '親子感情',
    value: '親子感情',
    desc: '親子彼此互動的模式是否親密，子女是否有信賴/依附關係或害怕相處'
  },
  {
    label: '意願能力',
    value: '意願能力',
    desc: '是否有積極(或消極)撫養的意願，相關撫養規劃與適合的親職能力'
  },
  {
    label: '父母經濟',
    value: '父母經濟',
    desc: '收入是否穩定且足以負擔子女養育所需，是否過度負債影響生計'
  },
  {
    label: '支持系統',
    value: '支持系統',
    desc: '其他親友是否能協助子女的生活照顧或父母的經濟支持'
  },
  {
    label: '父母生活',
    value: '父母生活',
    desc: '居家環境、是否有足夠空間或生活作習是否合適撫養子女'
  },
  {
    label: '主要照顧',
    value: '主要照顧',
    desc: '過往長期照顧且了解子女的生活情形，包括當前照顧的狀態是否應繼續'
  },
  {
    label: '子女年齡',
    value: '子女年齡',
    desc: '未成年子女的年紀是否幼小需要特別照顧，還是足以清楚表達意願。'
  },
  {
    label: '人格發展',
    value: '人格發展',
    desc: '對子女未來成長的影響(如能否穩定就學或有價值觀偏差)'
  },
  { label: '父母健康', value: '父母健康', desc: '心理或身體是否有不良狀況而不適任為子女照顧者' },
  {
    label: '父母職業',
    value: '父母職業',
    desc: '工作性質對子女照顧的影響(如常有夜班或出差的情形)'
  },
  { label: '子女意願', value: '子女意願', desc: '希望與雙親中哪一位共同生活，包括意願或態度' },
  {
    label: '友善父母',
    value: '友善父母',
    desc: '是否在子女面前誹謗對方，或阻擾對方與子女維持親子關係(含會面交往)'
  },
  {
    label: '父母品行',
    value: '父母品行',
    desc: '是否有不良嗜好、家庭暴力、精神虐待、吸毒或入監的紀錄'
  }
])

const fatherFavorableFactors = ref([
  {
    factor: '',
    description: ''
  }
])
const fatherFavorableVisible = ref(false)
const fatherUnfavorableFactors = ref([
  {
    factor: '',
    description: ''
  }
])
const fatherUnfavorableVisible = ref(false)
const motherFavorableFactors = ref([
  {
    factor: '',
    description: ''
  }
])
const motherFavorableVisible = ref(false)
const motherUnfavorableFactors = ref([
  {
    factor: '',
    description: ''
  }
])
const motherUnfavorableVisible = ref(false)

const addNewFactor = (factorsList: Array<factorObj>) => {
  factorsList.push({
    factor: '',
    description: ''
  })
}
</script>

<template>
  <ModeLayout title="模式三：選項加文字輸入" modeType="因素與理由">
    <template #instructions>
      <instructions></instructions>
    </template>
    <template #fatherFavorable>
      <div class="mt-2">
        <div
          v-for="(factor, index) in fatherFavorableFactors"
          :key="index"
          class="mb-3 bg-slate-100 rounded-xl px-2 py-1"
        >
          <div class="flex justify-begin items-center flex-wrap gap-1 mb-2">
            <div class="w-full text-center text-slate-600 font-bold text-sm relative">
              因素與理由 {{ index + 1 }}
              <button
                class="absolute right-0 top-0 rounded-full outline-none focus:ring-2 focus:ring-orange-200"
                @click="fatherFavorableFactors.splice(index, 1)"
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
              showClear
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
            <button class="bg-slate-50 rounded-xl border px-2 py-2 text-sm my-1 hover:bg-slate-100">
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
            placeholder="可直接輸入描述，或由範例文字開始編輯..."
          ></Textarea>
        </div>
      </div>
      <button
        @click="addNewFactor(fatherFavorableFactors)"
        class="w-full flex justify-center items-center rounded-xl outline-none bg-orange-50 text-orange-800 py-2 hover:bg-orange-100 focus:ring-4 focus:ring-orange-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 mr-1"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        新增因素與理由
      </button>
    </template>

    <template #fatherUnfavorable>
      <Button label="新增因素與理由"></Button>
    </template>

    <template #motherFavorable>
      <Button label="新增因素與理由"></Button>
    </template>

    <template #motherUnfavorable>
      <Button label="新增因素與理由"></Button>
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
