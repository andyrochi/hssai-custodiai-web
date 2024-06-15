<script setup lang="ts">
import ModeLayout from '@/components/ModeLayout.vue'
import instructions from '@/content/Mode3/mode3_instructions.md'
import { ref } from 'vue'
import Button from 'primevue/button'
import FactorBlock from '@/components/Mode3/FactorBlock.vue'
import AddFactorButton from '@/components/Mode3/AddFactorButton.vue'

interface factorObj {
  factor: string | undefined
  description: string
}

interface factorSourceObj {
  label: string
  value: string
  desc: string
}

const selectedFactor = ref('')
const factorsSource = ref<factorSourceObj[]>([
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

const fatherFavorableFactors = ref([])
const fatherFavorableVisible = ref(false)
const fatherUnfavorableFactors = ref([])
const fatherUnfavorableVisible = ref(false)
const motherFavorableFactors = ref([])
const motherFavorableVisible = ref(false)
const motherUnfavorableFactors = ref([])
const motherUnfavorableVisible = ref(false)

const addNewFactor = (factorsList: Array<factorObj>) => {
  factorsList.push({
    factor: undefined,
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
        <FactorBlock
          v-for="(factor, index) in fatherFavorableFactors"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="fatherFavorableFactors[index]"
          v-model:factorsList="fatherFavorableFactors"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="addNewFactor(fatherFavorableFactors)"> </AddFactorButton>
    </template>
    <template #fatherUnfavorable>
      <div class="mt-2">
        <FactorBlock
          v-for="(factor, index) in fatherUnfavorableFactors"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="fatherUnfavorableFactors[index]"
          v-model:factorsList="fatherUnfavorableFactors"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="addNewFactor(fatherUnfavorableFactors)"> </AddFactorButton>
    </template>

    <template #motherFavorable>
      <div class="mt-2">
        <FactorBlock
          v-for="(factor, index) in motherFavorableFactors"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="motherFavorableFactors[index]"
          v-model:factorsList="motherFavorableFactors"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="addNewFactor(motherFavorableFactors)"> </AddFactorButton>
    </template>

    <template #motherUnfavorable>
      <div class="mt-2">
        <FactorBlock
          v-for="(factor, index) in motherUnfavorableFactors"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="motherUnfavorableFactors[index]"
          v-model:factorsList="motherUnfavorableFactors"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="addNewFactor(motherUnfavorableFactors)"> </AddFactorButton>
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
