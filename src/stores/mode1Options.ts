import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMode1OptionsStore = defineStore('mode1-options', () => {
  const allFactors = reactive({
    fatherFavorable: [],
    fatherUnfavorable: [],
    motherFavorable: [],
    motherUnfavorable: []
  })

  return { allFactors }
})
