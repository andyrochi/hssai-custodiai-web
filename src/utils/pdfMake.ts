import pdfMake from 'pdfmake'
import type { Message } from '@/models/chatModels'

const pdfFonts = {
  NotoSansTC: {
    normal: 'http://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Regular.woff2',
    bold: 'http://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Bold.woff2'
  }
}

const pdfStyles = {
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
  },
  description: {
    fontSize: 12
  },
  normal: {
    margin: [0, 0, 0, 0],
    fontSize: 12
  },
  user: {
    margin: [0, 12, 0, 0],
    fontSize: 14,
    bold: true,
    color: '#f59e0b'
  },
  leAssistant: {
    margin: [0, 12, 0, 0],
    fontSize: 14,
    bold: true,
    color: '#7c2d12'
  }
}

export interface InputFactors {
  fatherFavorable: string
  fatherUnfavorable: string
  motherFavorable: string
  motherUnfavorable: string
}

export interface FiguresSrc {
  figure1Src: string
  figure2Src: string
}

export const createAndOpenPredictResultPdf = (
  pdfTitle: string,
  inputFactors: InputFactors,
  figuresSrc: FiguresSrc,
  interpretedResults: string
) => {
  const content: any[] = [
    {
      text: `AI 輔助親權裁判預測系統 - ${pdfTitle}`,
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
            text: inputFactors['fatherFavorable']
          },
          {
            text: '對父親不利的因素選項',
            style: 'factorTitle'
          },
          {
            text: inputFactors['fatherUnfavorable']
          }
        ],
        [
          {
            text: '對母親有利的因素選項',
            style: 'factorTitle'
          },
          {
            text: inputFactors['motherFavorable']
          },
          {
            text: '對母親不利的因素選項',
            style: 'factorTitle'
          },
          {
            text: inputFactors['motherUnfavorable']
          }
        ]
      ],
      columnGap: 16
    },
    {
      text: '預測結果',
      style: 'title'
    },
    {
      alignment: 'justify',
      columns: [
        {
          image: figuresSrc.figure1Src,
          width: 240
        },
        {
          image: figuresSrc.figure2Src,
          width: 240
        }
      ],
      columnGap: 16
    },
    {
      text: '為了避免使用者過度解讀AI預測的結果，本系統以小提琴圖(Violin Plot)來呈現親權判決預測結果，展示多達100組AI預測結果的機率分布狀態。點數越密集的區域代表越有可能的機率值，小提琴圖也越寬，反之亦然。',
      style: 'diagramDescription'
    },
    {
      text: '結果解讀',
      style: 'title'
    },
    { text: interpretedResults }
  ]

  pdfMake
    .createPdf(
      {
        content: content,
        defaultStyle: {
          font: 'NotoSansTC'
        },
        styles: pdfStyles
      },
      null,
      pdfFonts
    )
    .open()
}

export const createAndOpenChatHistoryPdf = (messageHistory: Message[], figuresSrc: FiguresSrc) => {
  // utilities
  interface pdfContent {
    text: string
    style: string
  }

  const predictIndex = messageHistory.findIndex(
    (curMessage: Message) => curMessage.status === 'predict'
  )
  const reduceMessagesToPdf = (prevArr: pdfContent[], curMessage: Message) => {
    if (curMessage.role !== 'system') {
      if (curMessage.role === 'assistant') {
        prevArr.push({
          text: 'Le姐:',
          style: 'leAssistant'
        })
      }
      if (curMessage.role === 'user') {
        prevArr.push({
          text: '你:',
          style: 'user'
        })
      }
      prevArr.push({
        text: curMessage.content,
        style: 'normal'
      })
    }
    return prevArr
  }

  const content: any[] = [
    {
      text: 'Le 姐家事協商好夥伴',
      style: 'header'
    },
    {
      text: `匯出日期：${new Date().toLocaleString('zh-TW')}`,
      style: 'description'
    }
  ]

  // parse until prediction
  const parsedMessage = messageHistory
    .slice(0, predictIndex)
    .reduce<pdfContent[]>(reduceMessagesToPdf, [])

  content.push(...parsedMessage)

  // push prediction images
  content.push({
    text: 'Le姐:',
    style: 'leAssistant'
  })
  content.push({
    alignment: 'justify',
    columns: [
      {
        image: figuresSrc.figure1Src,
        width: 240
      },
      {
        image: figuresSrc.figure2Src,
        width: 240
      }
    ],
    columnGap: 16
  })

  // push prediction results
  const predictMessages = messageHistory
    .slice(predictIndex)
    .reduce<pdfContent[]>(reduceMessagesToPdf, [])

  content.push(...predictMessages)

  pdfMake
    .createPdf(
      {
        content: content,
        defaultStyle: {
          font: 'NotoSansTC'
        },
        styles: pdfStyles
      },
      null,
      pdfFonts
    )
    .open()
}
