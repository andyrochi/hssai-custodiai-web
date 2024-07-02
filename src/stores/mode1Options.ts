import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { predictMode } from '@/api/modules/predictApi'

interface PredictRequest {
  model: string /* TODO: attribute should be fixed to [mode] in future */
  data: {
    AA: {
      Feature: string[]
      Sentence: string
    }
    AD: {
      Feature: string[]
      Sentence: string
    }
    RA: {
      Feature: string[]
      Sentence: string
    }
    RD: {
      Feature: string[]
      Sentence: string
    }
  }
}

interface ProbabilityStats {
  all_probs: number[]
  avg_prob: number
  max: number
  min: number
  q1: number
  q2: number
  q3: number
  std: number
}

interface ModelData {
  Applicant: ProbabilityStats
  Both: ProbabilityStats
  Respondent: ProbabilityStats
}

interface PredictResponse {
  [modelName: string]: ModelData
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

export const useMode1OptionsStore = defineStore('mode1-options', () => {
  const isLoading = ref<boolean>(false)
  const showPredict = ref<boolean>(false)
  const allFactors = reactive({
    fatherFavorable: [],
    fatherUnfavorable: [],
    motherFavorable: [],
    motherUnfavorable: []
  })

  const predictResult = reactive<PredictResponse>({
    T1: {
      Applicant: { ...defaultProbabilityStats },
      Both: { ...defaultProbabilityStats },
      Respondent: { ...defaultProbabilityStats }
    },
    T2: {
      Applicant: { ...defaultProbabilityStats },
      Both: { ...defaultProbabilityStats },
      Respondent: { ...defaultProbabilityStats }
    }
  })

  function $reset() {
    allFactors.fatherFavorable = []
    allFactors.fatherUnfavorable = []
    allFactors.motherFavorable = []
    allFactors.motherUnfavorable = []
  }

  const getPrediction = async () => {
    isLoading.value = true
    showPredict.value = false
    const payload: PredictRequest = {
      model: 'mode1',
      data: {
        AA: {
          Feature: allFactors['fatherFavorable'],
          Sentence: ''
        },
        AD: {
          Feature: allFactors['fatherUnfavorable'],
          Sentence: ''
        },
        RA: {
          Feature: allFactors['motherFavorable'],
          Sentence: ''
        },
        RD: {
          Feature: allFactors['motherUnfavorable'],
          Sentence: ''
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
