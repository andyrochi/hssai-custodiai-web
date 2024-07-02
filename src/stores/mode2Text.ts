import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { predictMode } from '@/api/modules/predictApi'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'

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
  const allFactors = reactive({
    fatherFavorable: '',
    fatherUnfavorable: '',
    motherFavorable: '',
    motherUnfavorable: ''
  })

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
  }

  const getPrediction = async () => {
    isLoading.value = true
    showPredict.value = false
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
      const response = await predictMode(payload)
      Object.assign(predictResult, response)
      showPredict.value = true
    } catch (err: any) {
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return { allFactors, $reset, getPrediction, predictResult, showPredict, isLoading }
})
