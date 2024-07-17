import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { predictMode } from '@/api/modules/predictApi'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'
import { interpretDataWithChat } from '@/api/modules/chatApi'
import pdfMake from 'pdfmake'
import VuePlotly from 'vue3-plotly-ts'
import Plotly from 'plotly.js-dist-min'

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

  const plot1Ref = ref<typeof VuePlotly>()
  const plot2Ref = ref<typeof VuePlotly>()

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
  }

  const getPrediction = async () => {
    isLoading.value = true
    showPredict.value = false
    interpretedResults.value = ''
    isInterpreting.value = true

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
      isLoading.value = false
      showPredict.value = true
      const interpretDataResponse = await interpretDataWithChat('mode2', payload, response)
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

  const exportResult = async () => {
    const fonts = {
      NotoSansTC: {
        normal: 'http://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Regular.woff2',
        bold: 'http://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Bold.woff2'
      }
    }

    const styles = {
      header: {
        fontSize: 22,
        bold: true
      },
      factorTitle: {
        fontSize: 14,
        bold: true
      },
      title: {
        fontSize: 16,
        bold: true,
        margin: [0, 12, 0, 6] // margin: [left, top, right, bottom]
      },
      date: {
        fontSize: 8
      },
      diagramDescription: {
        fontSize: 8,
        alignment: 'center'
      }
    }

    const content: any[] = [
      {
        text: 'AI 輔助親權裁判預測系統 - 模式二：文字輸入',
        style: 'header'
      },
      {
        text: `匯出日期：${new Date().toLocaleString('zh-TW')}`,
        style: 'date'
      },
      {
        text: '使用者輸入內容',
        style: 'title'
      },
      {
        alignment: 'justify',
        columns: [
          [
            {
              text: '對父親有利的因素選項',
              style: 'factorTitle'
            },
            {
              text: allFactors['fatherFavorable']
            },
            {
              text: '對父親不利的因素選項',
              style: 'factorTitle'
            },
            {
              text:
                allFactors['fatherUnfavorable'].length > 0 ? allFactors['fatherUnfavorable'] : '無'
            }
          ],
          [
            {
              text: '對母親有利的因素選項',
              style: 'factorTitle'
            },
            {
              text: allFactors['motherFavorable']
            },
            {
              text: '對母親不利的因素選項',
              style: 'factorTitle'
            },
            {
              text:
                allFactors['motherUnfavorable'].length > 0 ? allFactors['motherUnfavorable'] : '無'
            }
          ]
        ],
        columnGap: 16
      }
    ]

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

    content.push({
      text: '預測結果',
      style: 'title'
    })
    content.push(
      {
        alignment: 'justify',
        columns: [
          {
            image: plot1Image,
            width: 240
          },
          {
            image: plot2Image,
            width: 240
          }
        ],
        columnGap: 16
      },
      {
        text: '為了避免使用者過度解讀AI預測的結果，本系統以小提琴圖(Violin Plot)來呈現親權判決預測結果，展示多達100組AI預測結果的機率分布狀態。點數越密集的區域代表越有可能的機率值，小提琴圖也越寬，反之亦然。',
        style: 'diagramDescription'
      }
    )

    content.push({
      text: '結果解讀',
      style: 'title'
    })
    content.push({
      text: interpretedResults.value
    })

    pdfMake
      .createPdf(
        {
          content: content,
          defaultStyle: {
            font: 'NotoSansTC'
          },
          styles: styles
        },
        null,
        fonts
      )
      .open()
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
    setPlot2Ref
  }
})
