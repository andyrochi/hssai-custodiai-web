<script setup lang="ts">
import ModeLayout from '@/components/ModeLayout.vue'
import instructions from '@/content/Mode1/mode1_instructions.md'
import CustodyMultiSelect from '@/components/CustodyMultiSelect.vue'
import { useMode1OptionsStore } from '@/stores/mode1Options'
import { storeToRefs } from 'pinia'
import ViolinPlot from '@/components/charts/ViolinPlot.vue'
import MarkdownRenderer from '@/components/Chatbot/MarkdownRenderer.vue'
import InlineMessage from 'primevue/inlinemessage'

const store = useMode1OptionsStore()
const {
  allFactors,
  predictResult,
  showPredict,
  isLoading,
  interpretedResults,
  isInterpreting,
  fatherInvalid,
  motherInvalid
} = storeToRefs(store)
const { getPrediction, exportResult, setPlot1Ref, setPlot2Ref } = store

const factorsSource = [
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
]

const send = () => {
  // perform validation
  getPrediction()
}
</script>

<template>
  <ModeLayout
    title="模式一：選項輸入"
    modeType="因素選項"
    :predict="send"
    :reset="store.$reset"
    :isLoading="isLoading"
    :isInterpreting="isInterpreting"
    :showPredict="showPredict"
    :exportResult="exportResult"
  >
    <template #instructions>
      <instructions></instructions>
    </template>

    <template #fatherFavorable>
      <div class="mt-2">
        <CustodyMultiSelect
          v-model="allFactors['fatherFavorable']"
          :options="factorsSource"
          optionLabel="label"
          optionValue="value"
          optionDesc="desc"
          placeholder="請選擇因素"
          :invalid="fatherInvalid"
        >
        </CustodyMultiSelect>
        <InlineMessage severity="error" v-if="fatherInvalid" class="mt-2 w-full"
          >有利因素選項不得為空！</InlineMessage
        >
      </div>
    </template>

    <template #fatherUnfavorable>
      <div class="mt-2">
        <CustodyMultiSelect
          v-model="allFactors['fatherUnfavorable']"
          :options="factorsSource"
          optionLabel="label"
          optionValue="value"
          optionDesc="desc"
          placeholder="請選擇因素"
        >
        </CustodyMultiSelect>
      </div>
    </template>

    <template #motherFavorable>
      <div class="mt-2">
        <CustodyMultiSelect
          v-model="allFactors['motherFavorable']"
          :options="factorsSource"
          optionLabel="label"
          optionValue="value"
          optionDesc="desc"
          placeholder="請選擇因素"
          :invalid="motherInvalid"
        >
        </CustodyMultiSelect>
        <InlineMessage severity="error" v-if="motherInvalid" class="mt-2 w-full"
          >有利因素選項不得為空！</InlineMessage
        >
      </div>
    </template>

    <template #motherUnfavorable>
      <div class="mt-2">
        <CustodyMultiSelect
          v-model="allFactors['motherUnfavorable']"
          :options="factorsSource"
          optionLabel="label"
          optionValue="value"
          optionDesc="desc"
          placeholder="請選擇因素"
        >
        </CustodyMultiSelect>
      </div>
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

    <template #predict-result>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ViolinPlot
          :predict_result="predictResult"
          model_used="L1"
          :set-ref-function="setPlot1Ref"
        ></ViolinPlot>
        <ViolinPlot
          :predict_result="predictResult"
          model_used="L2"
          :set-ref-function="setPlot2Ref"
        ></ViolinPlot>
      </div>
    </template>

    <template #interpreted-result>
      <MarkdownRenderer :source="interpretedResults"></MarkdownRenderer>
    </template>
  </ModeLayout>
</template>
