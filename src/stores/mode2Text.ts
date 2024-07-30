import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { predictMode } from '@/api/modules/predictApi'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'
import { interpretDataWithChat } from '@/api/modules/chatApi'
import type { InputFactors, FiguresSrc } from '@/utils/pdfMake'
import { createAndOpenPredictResultPdf } from '@/utils/pdfMake'
import VuePlotly from 'vue3-plotly-ts'
import Plotly from 'plotly.js-dist-min'
import { useToast } from 'primevue/usetoast'
import { convertToTraditional } from '@/utils'

const defaultProbabilityStats = {
  all_probs: [],
  avg_prob: 0,
  max: 0,
  min: 0,
  q1: 0,
  q2: 0,
  q3: 0,
  std: 0
}

export const useMode2TextStore = defineStore('mode2-text', () => {
  const isLoading = ref<boolean>(false)
  const showPredict = ref<boolean>(false)
  const interpretedResults = ref<string>('')
  const isInterpreting = ref<boolean>(false)
  const allFactors = reactive({
    fatherFavorable: '',
    fatherUnfavorable: '',
    motherFavorable: '',
    motherUnfavorable: ''
  })
  const isValidate = ref<boolean>(false)
  const isPredictInterpretComplete = ref<boolean>(false)
  const fatherInvalid = computed(() => isValidate.value && !allFactors['fatherFavorable'])
  const motherInvalid = computed(() => isValidate.value && !allFactors['motherFavorable'])
  const plot1Ref = ref<typeof VuePlotly>()
  const plot2Ref = ref<typeof VuePlotly>()
  const toast = useToast()

  // define ref in store, and pass function to ViolinPlot to set it accordingly
  const setPlot1Ref = (ref: any) => {
    plot1Ref.value = ref
  }
  const setPlot2Ref = (ref: any) => {
    plot2Ref.value = ref
  }

  const predictResult = reactive<PredictResponse>({
    S1: {
      Applicant: { ...defaultProbabilityStats },
      Both: { ...defaultProbabilityStats },
      Respondent: { ...defaultProbabilityStats }
    },
    S2: {
      Applicant: { ...defaultProbabilityStats },
      Both: { ...defaultProbabilityStats },
      Respondent: { ...defaultProbabilityStats }
    }
  })

  function $reset() {
    allFactors.fatherFavorable = ''
    allFactors.fatherUnfavorable = ''
    allFactors.motherFavorable = ''
    allFactors.motherUnfavorable = ''
    showPredict.value = false
    interpretedResults.value = ''
    isValidate.value = false
    isPredictInterpretComplete.value = false
  }

  const getPrediction = async () => {
    isValidate.value = true
    if (fatherInvalid.value || motherInvalid.value) return
    isLoading.value = true
    showPredict.value = false
    interpretedResults.value = ''
    isInterpreting.value = true
    isPredictInterpretComplete.value = false

    const readStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, status: number) => {
      const partialLine = ''
      const decoder = new TextDecoder('utf-8')
      let notComplete = true
      while (notComplete) {
        const { value, done } = await reader.read()

        if (done) {
          notComplete = false
          continue
        }

        const text = decoder.decode(value, { stream: true })
        const decodedText = convertToTraditional(text)

        if (status !== 200) {
          interpretedResults.value += decodedText
          return
        }

        const chunk = partialLine + decodedText
        interpretedResults.value += chunk
      }
    }
    const payload: PredictRequest = {
      model: 'mode2',
      data: {
        AA: {
          Feature: [],
          Sentence: allFactors['fatherFavorable']
        },
        AD: {
          Feature: [],
          Sentence: allFactors['fatherUnfavorable']
        },
        RA: {
          Feature: [],
          Sentence: allFactors['motherFavorable']
        },
        RD: {
          Feature: [],
          Sentence: allFactors['motherUnfavorable']
        }
      }
    }
    try {
      const response = await predictMode(payload, toast)
      Object.assign(predictResult, response)
      isLoading.value = false
      showPredict.value = true
      const interpretDataResponse = await interpretDataWithChat('mode2', payload, response, toast)
      if (interpretDataResponse) {
        const reader = interpretDataResponse?.body?.getReader()
        const status = interpretDataResponse.status
        if (!reader) throw new Error('[Error] reader is undefined')
        await readStream(reader, status)
        interpretedResults.value += '\n \n *以上文字解讀為AI自動生成，僅供使用者參考。*'
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      isLoading.value = false
      isInterpreting.value = false
      isPredictInterpretComplete.value = true
    }
  }

  const getPlot = async () => {
    // parse plot
    const plot1RefGraphDivId = plot1Ref.value?.plotlyId
    const plot2RefGraphDivId = plot2Ref.value?.plotlyId
    const plot1Image = await Plotly.toImage(plot1RefGraphDivId, {
      format: 'png',
      height: 480,
      width: 480
    })
    const plot2Image = await Plotly.toImage(plot2RefGraphDivId, {
      format: 'png',
      height: 480,
      width: 480
    })

    return {
      plot1Image,
      plot2Image
    }
  }

  const exportResult = async () => {
    if (!isPredictInterpretComplete.value) {
      toast.add({
        severity: 'error',
        summary: '尚未完成預測',
        detail: '須完成預測才能匯出結果！',
        life: 5000
      })
      return
    }
    const pdfTitle = '模式二：文字輸入'
    const inputFactors: InputFactors = {
      fatherFavorable: allFactors['fatherFavorable'],
      fatherUnfavorable:
        allFactors['fatherUnfavorable'].length > 0 ? allFactors['fatherUnfavorable'] : '無',
      motherFavorable: allFactors['motherFavorable'],
      motherUnfavorable:
        allFactors['motherUnfavorable'].length > 0 ? allFactors['motherUnfavorable'] : '無'
    }
    const { plot1Image, plot2Image } = await getPlot()
    const figuresSrc: FiguresSrc = {
      figure1Src: plot1Image,
      figure2Src: plot2Image
    }
    const interpretedResultsStr: string = interpretedResults.value

    createAndOpenPredictResultPdf(pdfTitle, inputFactors, figuresSrc, interpretedResultsStr)
  }

  return {
    allFactors,
    $reset,
    getPrediction,
    predictResult,
    showPredict,
    isLoading,
    interpretedResults,
    isInterpreting,
    exportResult,
    setPlot1Ref,
    setPlot2Ref,
    fatherInvalid,
    motherInvalid,
    isPredictInterpretComplete
  }
})
