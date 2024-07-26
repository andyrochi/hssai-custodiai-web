<script setup lang="ts">
import ModeLayout from '@/components/ModeLayout.vue'
import instructions from '@/content/Mode2/mode2_instructions.md'
import TextInputComponent from '@/components/Mode2/TextInputComponent.vue'
import { useMode2TextStore } from '@/stores/mode2Text'
import { storeToRefs } from 'pinia'
import ViolinPlot from '@/components/charts/ViolinPlot.vue'
import MarkdownRenderer from '@/components/Chatbot/MarkdownRenderer.vue'
import InlineMessage from 'primevue/inlinemessage'

const store = useMode2TextStore()
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

const dataTemplate = {
  advantage: [
    {
      type: '經濟工作情況',
      item: [
        {
          label:
            '當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。',
          value:
            '當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。'
        }
      ]
    },
    {
      type: '孩童個人意願',
      item: [
        {
          label:
            '當孩子對於與家庭成員間互動，何者能給予其安全、滿足之心理環境及生活照顧，已有判斷能力。有表達與當事人共同生活之意願。',
          value:
            '當孩子對於與家庭成員間互動，何者能給予其安全、滿足之心理環境及生活照顧，已有判斷能力。有表達與當事人共同生活之意願。'
        }
      ]
    },
    {
      type: '平日相處關係',
      item: [
        {
          label:
            '孩子對當事人有一定程度的依賴感及安全感存在。例如孩子會直接對當事人撒嬌求助，並且得到安撫。',
          value:
            '孩子對當事人有一定程度的依賴感及安全感存在。例如孩子會直接對當事人撒嬌求助，並且得到安撫。'
        }
      ]
    },
    {
      type: '主要照顧者',
      item: [
        {
          label:
            '當事人目前為孩子之主要照顧者，並能提供穩定生活及正向發展，並無受不當照顧情形，與當事人互動情形亦良好。',
          value:
            '當事人目前為孩子之主要照顧者，並能提供穩定生活及正向發展，並無受不當照顧情形，與當事人互動情形亦良好。'
        }
      ]
    },
    {
      type: '居住環境評估',
      item: [
        {
          label:
            '當事人住處的社區環境足以提供食衣住行育樂的活動安排，而內部居家環境的設備完善，環境寬敞且乾淨整潔，合適孩子居住。',
          value:
            '當事人住處的社區環境足以提供食衣住行育樂的活動安排，而內部居家環境的設備完善，環境寬敞且乾淨整潔，合適孩子居住。'
        }
      ]
    },
    {
      type: '親友支持系統',
      item: [
        {
          label:
            '當事人的家人親戚亦住在附近或同住，可以協助支援孩子的照顧。孩子與其互動亦自然和諧。',
          value:
            '當事人的家人親戚亦住在附近或同住，可以協助支援孩子的照顧。孩子與其互動亦自然和諧。'
        }
      ]
    },
    {
      type: '過往陪伴經驗',
      item: [
        {
          label:
            '當事人能夠具體陳述對孩子之教育理念及教養態度，且皆會於休假及空閒時，陪伴子女外出遊玩，培養親子互動。',
          value:
            '當事人能夠具體陳述對孩子之教育理念及教養態度，且皆會於休假及空閒時，陪伴子女外出遊玩，培養親子互動。'
        }
      ]
    },
    {
      type: '友善父母觀念',
      item: [
        {
          label: '當事人願意讓對方探視孩子，繼續維繫親子關係。',
          value: '當事人願意讓對方探視孩子，繼續維繫親子關係。'
        }
      ]
    },
    {
      type: '其他相關描述',
      item: [
        {
          label: '當事人爭取撫養孩子親權之意願積極，動機是希望陪伴孩子在較好的環境中成長。',
          value: '當事人爭取撫養孩子親權之意願積極，動機是希望陪伴孩子在較好的環境中成長。'
        },
        {
          label:
            '孩子現仍處於嬰幼階段，亟需母親的關愛照顧，而當事人長期與其共同生活，對其人格特質、身心發展狀況及生活需求甚為瞭解。',
          value:
            '孩子現仍處於嬰幼階段，亟需母親的關愛照顧，而當事人長期與其共同生活，對其人格特質、身心發展狀況及生活需求甚為瞭解。'
        }
      ]
    }
  ],
  disadvantage: [
    {
      type: '經濟工作情況',
      item: [
        {
          label:
            '當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。',
          value:
            '當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。'
        }
      ]
    },
    {
      type: '孩童個人意願',
      item: [
        {
          label: '孩子年紀已經夠大，已能了解家庭成員互動的關係，意願上比較不希望與當事人同住。',
          value: '孩子年紀已經夠大，已能了解家庭成員互動的關係，意願上比較不希望與當事人同住。'
        }
      ]
    },
    {
      type: '平日相處關係',
      item: [
        {
          label:
            '孩童對當事人於雙方婚姻存續期間之諸多作為感到嫌惡，並因當事人離異時造成心靈傷害，而與之關係疏離、緊張。',
          value:
            '孩童對當事人於雙方婚姻存續期間之諸多作為感到嫌惡，並因當事人離異時造成心靈傷害，而與之關係疏離、緊張。'
        }
      ]
    },
    {
      type: '主要照顧者',
      item: [
        {
          label:
            '當事人目前並非與孩子同住，或者並非孩子生活的主要照顧者，對其個性、生活所需上了解可能不足。',
          value:
            '當事人目前並非與孩子同住，或者並非孩子生活的主要照顧者，對其個性、生活所需上了解可能不足。'
        }
      ]
    },
    {
      type: '居住環境評估',
      item: [
        {
          label:
            '當事人的居住地點附近環境複雜，且屋內並無孩子獨立的生活空間，居家環境不太適合孩子成長。',
          value:
            '當事人的居住地點附近環境複雜，且屋內並無孩子獨立的失活空間，居家環境不太適合孩子成長。'
        }
      ]
    },
    {
      type: '親友支持系統',
      item: [
        {
          label:
            '當事人的其他親戚朋友並未同住或少有往來，與孩子的關係陌生，無法提供足夠的支持系統。',
          value:
            '當事人的其他親戚朋友並未同住或少有往來，與孩子的關係陌生，無法提供足夠的支持系統。'
        }
      ]
    },
    {
      type: '過往陪伴經驗',
      item: [
        {
          label:
            '當事人過往在家庭生活中因為工作或個性，比較少陪伴孩子與之相處，亦不太了解其生活狀況。孩子與之單獨相處會有焦慮。',
          value:
            '當事人過往在家庭生活中因為工作或個性，比較少陪伴孩子與之相處，亦不太了解其生活狀況。孩子與之單獨相處會有焦慮。'
        }
      ]
    },
    {
      type: '友善父母觀念',
      item: [
        {
          label: '當事人不願意或阻撓對方探視孩子或任何接觸。',
          value: '當事人不願意或阻撓對方探視孩子或任何接觸。'
        }
      ]
    },
    {
      type: '其他相關描述',
      item: [
        {
          label:
            '當事人若單獨撫養孩子，因為工作關係，可能沒有時間管教，會繼續放任其偏差之行為，不利於孩子的成長與發展。',
          value:
            '當事人若單獨撫養孩子，因為工作關係，可能沒有時間管教，會繼續放任其偏差之行為，不利於孩子的成長與發展。'
        },
        {
          label:
            '當事人工作的時間不穩定，長需要夜間輪班工作。孩子現尚幼小，故配合當事人活動尚可，但日後恐會影響到就學及生活作息。',
          value:
            '當事人工作的時間不穩定，長需要夜間輪班工作。孩子現尚幼小，故配合當事人活動尚可，但日後恐會影響到就學及生活作息。'
        }
      ]
    }
  ]
}

const send = () => {
  // perform validation
  getPrediction()
}
</script>

<template>
  <ModeLayout
    title="模式二：文字輸入"
    modeType="理由文字"
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
      <TextInputComponent
        v-model="allFactors['fatherFavorable']"
        dialogTitle="對父親有利的理由文字"
        :descriptionList="dataTemplate['advantage']"
        class="mt-2"
        :invalid="fatherInvalid"
      >
      </TextInputComponent>
      <InlineMessage severity="error" v-if="fatherInvalid" class="mt-2 w-full"
        >有利理由文字不得為空！</InlineMessage
      >
    </template>
    <template #fatherUnfavorable>
      <TextInputComponent
        v-model="allFactors['fatherUnfavorable']"
        dialogTitle="對父親不利的理由文字"
        :descriptionList="dataTemplate['disadvantage']"
        class="mt-2"
      >
      </TextInputComponent>
    </template>
    <template #motherFavorable>
      <TextInputComponent
        v-model="allFactors['motherFavorable']"
        dialogTitle="對母親有利的理由文字"
        :descriptionList="dataTemplate['advantage']"
        class="mt-2"
        :invalid="motherInvalid"
      >
      </TextInputComponent>
      <InlineMessage severity="error" v-if="motherInvalid" class="mt-2 w-full"
        >有利理由文字不得為空！</InlineMessage
      >
    </template>
    <template #motherUnfavorable>
      <TextInputComponent
        v-model="allFactors['motherUnfavorable']"
        dialogTitle="對母親不利的理由文字"
        :descriptionList="dataTemplate['disadvantage']"
        class="mt-2"
      >
      </TextInputComponent>
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
          model_used="S1"
          :set-ref-function="setPlot1Ref"
        ></ViolinPlot>
        <ViolinPlot
          :predict_result="predictResult"
          model_used="S2"
          :set-ref-function="setPlot2Ref"
        ></ViolinPlot>
      </div>
    </template>

    <template #interpreted-result>
      <MarkdownRenderer :source="interpretedResults"></MarkdownRenderer>
    </template>
  </ModeLayout>
</template>
