import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { predictMode } from '@/api/modules/predictApi'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'

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
  }

  const getPrediction = async () => {
    isLoading.value = true
    showPredict.value = false

    const reduceFeatures = (acc: string[], factorObj: factorObj) => {
      if (factorObj.factor !== undefined) {
        acc.push(factorObj.factor)
      }
      return acc
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
      showPredict.value = true
    } catch (err: any) {
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return { allFactors, addNewFactor, $reset, getPrediction, predictResult, showPredict, isLoading }
})
