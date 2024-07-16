import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { predictMode } from '@/api/modules/predictApi'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'
import { interpretDataWithChat } from '@/api/modules/chatApi'

export interface factorObj {
  factor: string | undefined
  description: string
}

export interface Factors {
  fatherFavorable: factorObj[]
  fatherUnfavorable: factorObj[]
  motherFavorable: factorObj[]
  motherUnfavorable: factorObj[]
}

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

export const useMode3OptionsTextStore = defineStore('mode3-options-text', () => {
  const isLoading = ref<boolean>(false)
  const showPredict = ref<boolean>(false)
  const interpretedResults = ref<string>('')
  const isInterpreting = ref<boolean>(false)
  const allFactors: Factors = reactive({
    fatherFavorable: [],
    fatherUnfavorable: [],
    motherFavorable: [],
    motherUnfavorable: []
  })

  const predictResult = reactive<PredictResponse>({
    C1: {
      Applicant: { ...defaultProbabilityStats },
      Both: { ...defaultProbabilityStats },
      Respondent: { ...defaultProbabilityStats }
    },
    C2: {
      Applicant: { ...defaultProbabilityStats },
      Both: { ...defaultProbabilityStats },
      Respondent: { ...defaultProbabilityStats }
    }
  })

  function addNewFactor(factorType: keyof Factors) {
    allFactors[factorType].push({
      factor: undefined,
      description: ''
    })
  }

  function $reset() {
    allFactors.fatherFavorable = []
    allFactors.fatherUnfavorable = []
    allFactors.motherFavorable = []
    allFactors.motherUnfavorable = []
    showPredict.value = false
    interpretedResults.value = ''
  }

  const getPrediction = async () => {
    isLoading.value = true
    showPredict.value = false
    interpretedResults.value = ''
    isInterpreting.value = true

    const reduceFeatures = (acc: string[], factorObj: factorObj) => {
      if (factorObj.factor !== undefined) {
        acc.push(factorObj.factor)
      }
      return acc
    }
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

        const decodedText = decoder.decode(value, { stream: true })
        // const decodedText = this.convertToTraditional(decoder.decode(value, { stream: true }));

        if (status !== 200) {
          interpretedResults.value += decodedText
          return
        }

        const chunk = partialLine + decodedText
        interpretedResults.value += chunk
      }
    }

    const payload: PredictRequest = {
      model: 'mode3',
      data: {
        AA: {
          Feature: allFactors['fatherFavorable'].reduce<string[]>(reduceFeatures, []),
          Sentence: allFactors['fatherFavorable']
            .map((factorObj) => factorObj.description)
            .join(' ')
        },
        AD: {
          Feature: allFactors['fatherUnfavorable'].reduce<string[]>(reduceFeatures, []),
          Sentence: allFactors['fatherUnfavorable']
            .map((factorObj) => factorObj.description)
            .join(' ')
        },
        RA: {
          Feature: allFactors['motherFavorable'].reduce<string[]>(reduceFeatures, []),
          Sentence: allFactors['motherFavorable']
            .map((factorObj) => factorObj.description)
            .join(' ')
        },
        RD: {
          Feature: allFactors['motherUnfavorable'].reduce<string[]>(reduceFeatures, []),
          Sentence: allFactors['motherUnfavorable']
            .map((factorObj) => factorObj.description)
            .join(' ')
        }
      }
    }
    try {
      const response = await predictMode(payload)
      Object.assign(predictResult, response)
      isLoading.value = false
      showPredict.value = true
      const interpretDataResponse = await interpretDataWithChat('mode3', payload, response)
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
    }
  }

  return {
    allFactors,
    addNewFactor,
    $reset,
    getPrediction,
    predictResult,
    showPredict,
    isLoading,
    interpretedResults,
    isInterpreting
  }
})
