import { reactive } from 'vue'
import { defineStore } from 'pinia'

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

export const useMode3OptionsTextStore = defineStore('mode3-options-text', () => {
  const allFactors: Factors = reactive({
    fatherFavorable: [],
    fatherUnfavorable: [],
    motherFavorable: [],
    motherUnfavorable: []
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

  return { allFactors, addNewFactor, $reset }
})
