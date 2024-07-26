<script setup lang="ts">
import ModeLayout from '@/components/ModeLayout.vue'
import instructions from '@/content/Mode3/mode3_instructions.md'
import { ref, computed } from 'vue'
import FactorBlock from '@/components/Mode3/FactorBlock.vue'
import AddFactorButton from '@/components/Mode3/AddFactorButton.vue'
import Dialog from 'primevue/dialog'
import { useMode3OptionsTextStore } from '@/stores/mode3OptionsText'
import type { Factors } from '@/stores/mode3OptionsText'
import { storeToRefs } from 'pinia'
import ViolinPlot from '@/components/charts/ViolinPlot.vue'
import MarkdownRenderer from '@/components/Chatbot/MarkdownRenderer.vue'
import InlineMessage from 'primevue/inlinemessage'

interface factorSourceObj {
  label: string
  value: string
  desc: string
}

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

const factorDescriptionsSource = {
  advantage: {
    親子感情: '孩子習慣由當事人照顧生活及一起行動，表現出對其依賴與信任，互動緊密。',
    意願能力: '當事人爭取孩子監護權之態度十分積極且堅定，且有足夠的親職能力提供教育及生活規劃。',
    父母經濟: '當事人具有正當的工作且有穩定之經濟基礎，生活開銷支應無虞。',
    支持系統: '當事人的家人皆為友善之親屬，可以在有需要的時候協助照顧孩子的生活起居。',
    父母生活:
      '當事人住家空間足夠安排孩子自己的房間，而住家距離學區及鬧區約5分鐘車程可及，生活機能便利，應適宜孩子居住。',
    主要照顧:
      '孩子自幼即與當事人同住，由當事人擔任其主要生活照顧者，目前生活平順，應減少不必要的變動。',
    子女年齡: '孩子尚屬年幼，應極需有細心關照之需要，較適合由當事人長期照顧。',
    人格發展:
      '孩子年齡已漸入青春期階段，開始發展形塑自己之人格與想法，在人格發展上亟需家人關心與引導，由當事人擔任親權人更為適切。',
    父母健康: '當事人健康狀況良好正常，無重大傷病，可親自負擔孩子之生活照顧。',
    父母職業: '當事人有穩定工作與收入來源，亦可於工作時間外照顧未成年子女。',
    子女意願: '孩子年齡已達青少年階段，可清楚表達自己的意思，希望能與當事人同住。',
    友善父母: '當事人願意讓對方繼續探望孩子，維繫親子關係，對孩子的成長較為有利。',
    父母品行: '當事人的品性與素行並無不當紀錄。'
  },
  disadvantage: {
    親子感情: '孩子對當事人平日的言行感到不舒服，單獨與之相處有疏離或緊張的關係。',
    意願能力: '當事人雖表示有爭取監護權的意願，但是尚未有完整的撫養規劃，教養方面的能力尚嫌不足。',
    父母經濟:
      '當事人目前尚未有工作或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。',
    支持系統: '孩子與當事人的同居者原生家庭關係不佳，若獨自養育恐無法有足夠的支持系統協助。',
    父母生活:
      '當事人的居住地點附近環境複雜，且屋內並無孩子獨立的失活空間，居家環境不太適合孩子成長。',
    主要照顧:
      '當事人目前並非與孩子同住，或者並非孩子生活的主要照顧者，對其個性、生活所需上了解可能不足。',
    子女年齡: '孩子尚屬年幼，需要更多細心關照，恐不利當事人長期照顧。',
    人格發展:
      '孩子年齡已漸入青春期階段，開始發展形塑自己之人格與想法，在人格發展上亟需家人關心與引導，當事人顯然較缺乏合適之溝通技巧，較不利於親職輔導。',
    父母健康: '當事人近年有重大傷病，對負擔孩子之生活照顧恐有疑慮。',
    父母職業: '當事人雖有穩定工作，但常常需要加班或外地出差，對於照顧未成年子女恐有不足之處。',
    子女意願: '孩子年齡已達青少年階段，可清楚表達自己的意思，較不願意與當事人同住。',
    友善父母: '當事人曾將孩子帶回後，不願孩子與對方會面交往，對孩子的成長確有不利之處。',
    父母品行: '當事人曾有不當管教行為，且因涉傷害罪而素行不良，恐影響孩子之健全人格與品行發展。'
  }
}

const factorTitleMapping = {
  fatherFavorable: '對父親有利的因素與理由',
  fatherUnfavorable: '對父親不利的因素與理由',
  motherFavorable: '對母親有利的因素與理由',
  motherUnfavorable: '對母親不利的因素與理由'
}

const store = useMode3OptionsTextStore()
const {
  allFactors,
  predictResult,
  showPredict,
  isLoading,
  interpretedResults,
  isInterpreting,
  fatherInvalid,
  motherInvalid,
  isValidate
} = storeToRefs(store)
const { getPrediction, exportResult, setPlot1Ref, setPlot2Ref } = store

const showModal = ref(false)
const modalFactorType = ref<keyof Factors>('fatherFavorable')
const modalFactorIndex = ref(0)
const modalTitle = ref('')
const modalDescType = computed(() => {
  return modalFactorType.value.indexOf('Favorable') >= 0 ? 'advantage' : 'disadvantage'
})

const setModalProps = (factorType: keyof Factors, index: number, newModalTitle: string) => {
  showModal.value = true
  modalFactorType.value = factorType
  modalFactorIndex.value = index
  modalTitle.value = newModalTitle
}

const setModalPropsWrapper = (factorType: keyof Factors, index: number, newModalTitle: string) => {
  return () => setModalProps(factorType, index, newModalTitle)
}

const setFactorAndDescription = (factorKey: string, description: string) => {
  allFactors.value[modalFactorType.value][modalFactorIndex.value].factor = factorKey
  allFactors.value[modalFactorType.value][modalFactorIndex.value].description = description
  showModal.value = false
}

const send = () => {
  // perform validation
  getPrediction()
}
</script>

<template>
  <ModeLayout
    title="模式三：選項加文字輸入"
    modeType="因素與理由"
    :predict="send"
    :reset="store.$reset"
    :isLoading="isLoading"
    :is-interpreting="isInterpreting"
    :showPredict="showPredict"
    :exportResult="exportResult"
  >
    <template #instructions>
      <instructions></instructions>
    </template>
    <template #fatherFavorable>
      <div class="mt-2">
        <FactorBlock
          v-for="(factor, index) in allFactors['fatherFavorable']"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="allFactors['fatherFavorable'][index]"
          v-model:factorsList="allFactors['fatherFavorable']"
          :setModal="
            setModalPropsWrapper('fatherFavorable', index, factorTitleMapping['fatherFavorable'])
          "
          :validate="isValidate"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="store.addNewFactor('fatherFavorable')"> </AddFactorButton>
      <InlineMessage severity="error" v-if="fatherInvalid" class="mt-2 w-full"
        >至少需要一項有利因素與理由!</InlineMessage
      >
    </template>
    <template #fatherUnfavorable>
      <div class="mt-2">
        <FactorBlock
          v-for="(factor, index) in allFactors['fatherUnfavorable']"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="allFactors['fatherUnfavorable'][index]"
          v-model:factorsList="allFactors['fatherUnfavorable']"
          :setModal="
            setModalPropsWrapper(
              'fatherUnfavorable',
              index,
              factorTitleMapping['fatherUnfavorable']
            )
          "
          :validate="isValidate"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="store.addNewFactor('fatherUnfavorable')"> </AddFactorButton>
    </template>

    <template #motherFavorable>
      <div class="mt-2">
        <FactorBlock
          v-for="(factor, index) in allFactors['motherFavorable']"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="allFactors['motherFavorable'][index]"
          v-model:factorsList="allFactors['motherFavorable']"
          :setModal="
            setModalPropsWrapper('motherFavorable', index, factorTitleMapping['motherFavorable'])
          "
          :validate="isValidate"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="store.addNewFactor('motherFavorable')"> </AddFactorButton>
      <InlineMessage severity="error" v-if="motherInvalid" class="mt-2 w-full"
        >至少需要一項有利因素與理由!</InlineMessage
      >
    </template>

    <template #motherUnfavorable>
      <div class="mt-2">
        <FactorBlock
          v-for="(factor, index) in allFactors['motherUnfavorable']"
          :key="index"
          :index="index"
          :factorsSource="factorsSource"
          v-model:factor="allFactors['motherUnfavorable'][index]"
          v-model:factorsList="allFactors['motherUnfavorable']"
          :setModal="
            setModalPropsWrapper(
              'motherUnfavorable',
              index,
              factorTitleMapping['motherUnfavorable']
            )
          "
          :validate="isValidate"
        >
        </FactorBlock>
      </div>
      <AddFactorButton @click="store.addNewFactor('motherUnfavorable')"> </AddFactorButton>
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
          model_used="C1"
          :set-ref-function="setPlot1Ref"
        ></ViolinPlot>
        <ViolinPlot
          :predict_result="predictResult"
          model_used="C2"
          :set-ref-function="setPlot2Ref"
        ></ViolinPlot>
      </div>
    </template>
    <template #interpreted-result>
      <MarkdownRenderer :source="interpretedResults"></MarkdownRenderer>
    </template>
  </ModeLayout>

  <Dialog
    v-model:visible="showModal"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="">
        <div class="text-xl">{{ modalTitle }}</div>
        <div class="text-sm text-slate-400">選擇符合的因素與描述，匯入並加以編輯。</div>
      </div>
    </template>
    <div>
      <div
        v-for="(descriptions, factorKey) in factorDescriptionsSource[modalDescType]"
        :key="factorKey"
      >
        <div class="mb-3">
          <div class="mb-2 border rounded-lg px-4 py-2 hover:shadow focus-within:shadow">
            <div class="mb-1">
              <span class="font-bold text-orange-800">{{ factorKey }}</span>
              <span class="text-xs text-slate-800"> </span>
            </div>
            <div>{{ descriptions }}</div>
            <div class="flex justify-end w-full">
              <button
                @click="setFactorAndDescription(factorKey, descriptions)"
                class="text-nowrap bg-orange-100 text-orange-800 rounded px-2 py-1 hover:bg-orange-50 focus:outline-none focus:ring-orange-50 focus:ring-4 active:bg-orange-200 disabled:bg-slate-50 disabled:text-slate-500"
              >
                匯入
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
