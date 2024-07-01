import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMode1OptionsStore = defineStore('mode1-options', () => {
  const allFactors = reactive({
    fatherFavorable: [],
    fatherUnfavorable: [],
    motherFavorable: [],
    motherUnfavorable: []
  })

  function $reset() {
    allFactors.fatherFavorable = []
    allFactors.fatherUnfavorable = []
    allFactors.motherFavorable = []
    allFactors.motherUnfavorable = []
  }

  return { allFactors, $reset }
})
