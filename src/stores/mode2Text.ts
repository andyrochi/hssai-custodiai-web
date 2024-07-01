import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMode2TextStore = defineStore('mode2-text', () => {
  const allFactors = reactive({
    fatherFavorable: '',
    fatherUnfavorable: '',
    motherFavorable: '',
    motherUnfavorable: ''
  })

  function $reset() {
    allFactors.fatherFavorable = ''
    allFactors.fatherUnfavorable = ''
    allFactors.motherFavorable = ''
    allFactors.motherUnfavorable = ''
  }

  return { allFactors, $reset }
})
