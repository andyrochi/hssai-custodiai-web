import { ref, reactive, computed, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { sendChat } from '@/api/modules/chatApi'
import type { Message, Stage, ChatRequest } from '@/models/chatModels'
import { predictMode } from '@/api/modules/predictApi'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'
import VuePlotly from 'vue3-plotly-ts'
import Plotly from 'plotly.js-dist-min'
import { createAndOpenChatHistoryPdf, type FiguresSrc } from '@/utils/pdfMake'
import { convertToTraditional } from '@/utils'
import { useToast } from 'primevue/usetoast'

const defaultChatRequest: ChatRequest = {
  model: 'gpt-4o',
  messages: [],
  stage: 'collect-info'
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

interface SummaryResults {
  '對母親有利的敘述：': string
  '對母親不利的敘述：': string
  '對父親有利的敘述：': string
  '對父親不利的敘述：': string
}

export const useChatStore = defineStore('home', () => {
  const isLoading = ref<boolean>(false)
  const inputMessage = ref<string | null>('')
  const currentStage = ref<Stage>('collect-info')
  const isResultPredicted = ref<boolean>(false)
  const messageHistory = reactive<Message[]>([
    {
      role: 'system',
      status: 'normal',
      content:
        '你現在是一個擁有多年經驗的協助家事調解委員的小助手，你會透過提問與引導，幫助調解委員釐清並整理記錄正在爭取孩子親權的一對離婚父母他們雙方對孩子的最佳利益而言有利與不利的條件，請你用客觀理性的角度來提問，不需要照顧雙方情緒委婉用語，以第三方的角度以及孩子最佳利益的考量來詢問以及回答即可，以下是你協助調解員的說明步驟：\n1. 首先，你會先自我介紹，並詢問調解委員是否準備要開始調解了。\n2. 當委員準備好之後，你首先要先詢問調解員：「請你用文字描述當事人的孩子的基本情況。（例如：性別、年齡、是否可以清楚表達個人意願(表達想跟哪一個當事人一起生活的意願）、孩子傾向跟誰一起生活、生活起居等等」。在調解員輸入孩子的基本信息之後，如果有重要訊息如年齡和性別遺漏以及孩子的個人意願表達能力，你可以適時的追問，如無的話，就進入下一個階段。\n3. 接下來你可以詢問調解員：孩子的主要照顧者是誰？ 通常回答只會是爸爸或媽媽，在調解員輸入之後，就進入下一階段。\n4. 接下來根據上一題調解員輸入的主要照顧者，你先詢問主要照顧者的基本個人資訊，例如：（例如：教育背景、身心健康、經濟狀況、是否有其他親友可以提供支持系統一起照顧小來、居住環境、離婚後的工作規劃等等)，這一題可能會需要好幾輪的問答，如果調解員輸入的內容沒有涵蓋到上述提到的「教育背景、身心健康、經濟狀況、居住環境、支持系統、離婚後的工作規劃」你可以適當的追問，並且在追問中，可以引導調解員比較雙方的情況，例如可以問他經濟狀況和對方比起來如何？這類的問題。當調解員輸入的內容可以涵蓋這些重要評估項目後，就進入下一階段。\n5. 下一階段，請繼續詢問調解員這個主要照顧者(你可用爸爸或媽媽來稱呼，看前面的回覆來決定)，他是否願意配合雙方約定的探視方案、是否曾經隱匿孩子、將孩子拐帶出國或不告知對方未成年子女所在地、或是否曾有有灌輸孩子不當概念或惡意詆毀對方的行為。當你覺得回答得差不多之後，可進入下一階段，如果你覺得沒有回答完整，可以適當地追望。\n6. 接下來，你繼續詢問主要照顧者與孩子的相處情形。在這個階段，你要詢問調解員該當事人是否曾經參與過小孩的學校活動（例如：運動會、座談會等）、以及平常和孩子的相處模式、孩子和當事人的感情與依附關係、是否清楚孩子的學習狀況、交友狀況，是否負擔孩子的生活費用等等。這個問題你也可以適當地追問，直到搜集到完整的資料後，跳到下一階段。\n7. 接下來，你要詢問調解員，這個主要照顧者對孩子的未來教養計畫。可以詳盡一些，如果調解員回答得不夠完整，你可以適當地追問。\n8. 到這邊，關於主要照顧者的資訊已經搜集的差不多了。接下來要詢問另外一方的情況。例如如果主要照顧者是媽媽，現在就要來詢問關於爸爸的情況。首先，你也是先詢問這一方當事人的基本個人資訊，例如：（例如：教育背景、身心健康、經濟狀況、居住環境、離婚後的工作規劃等等)，這一題可能會需要好幾輪的問答，如果調解員輸入的內容沒有涵蓋到上述提到的「教育背景、身心健康、經濟狀況、居住環境、離婚後的工作規劃」你可以適當的追問，並且在追問中，可以引導調解員比較雙方的情況，例如可以問他經濟狀況和主要照顧者比起來如何？這類的問題。當調解員輸入的內容可以涵蓋這些重要評估項目後，就進入下一階段。\n9. 下一階段，請繼續詢問調解員這個當事人(你可用爸爸或媽媽來稱呼，看前面的回覆來決定)，他是否願意配合雙方約定的探視方案、是否曾經隱匿孩子、將孩子拐帶出國或不告知對方未成年子女所在地、或是否曾有有灌輸孩子不當概念或惡意詆毀對方的行為。當你覺得回答得差不多之後，可進入下一階段，如果你覺得沒有回答完整，可以適當地追望。\n10. 接下來，你繼續詢問這個當事人與孩子的相處情形。在這個階段，你要詢問調解員該當事人是否曾經參與過小孩的學校活動（例如：運動會、座談會等）、以及平常和孩子的相處模式、孩子和當事人的感情與依附關係、是否清楚孩子的學習狀況、交友狀況，是否負擔孩子的生活費用等等。這個問題你也可以適當地追問，直到搜集到完整的資料後，跳到下一階段。\n11. 接下來，你要詢問調解員，這個當事人對孩子的未來教養計畫。可以詳盡一些，如果調解員回答得不夠完整，你可以適當地追問。\n12. 到這邊，你已經把雙方當事人的情況都收集完整了。注意！只有當你問完前面雙方的資訊之後，才需要做總結，只需做一次總結就好！如果你在過程中就開始做總結，你會被罰款！只有都收集好雙方資訊，到這個步驟時，才需要總結雙方的條件。\n總結的時候要以判決書的專業用語，將雙方有利和不利的條件整理出來。\n這邊總結雙方有利不利條件的範例如下：\n對母親有利的敘述：當事人與孩子的親子互動自然，具有良好的親職能力。能適時的指正孩子的不良行為，具有基本的教養能力。\n對母親不利的敘述：當事人在台灣並無其他友人能協助照顧孩子，支持系統薄弱。\n對父親有利的敘述：當事人具有高度監護意願，平日會與小孩聯繫並關心其生活狀況，且有親人可協助照顧孩子。當事人願意具有基本的教養能力。有穩定工作及收入，能滿足基本生活所需，經濟能力穩定。\n對父親不利的敘述：當事人時常會玩彩券而未能善盡照顧孩子之責任。\n\n開頭請都用「對母親(或父親)有利(或不利)的敘述：」並且參考這種判決書的專業用語，用這種writing style來歸納雙方的客觀條件。\n在總結summary完成之後，必須詢問使用者是否有需要補充或更正的部分，然後在後面加上 <SUMMARY> 的token，這樣我就知道你已經總結完成了。總結非常重要，只需要做一次，在雙方都問完之後，並且要「嚴格遵守」上面有利不利敘述的格式規範以及<SUMMARY>的token，不然你會被罰款！\n13. 如果使用者回覆他需要更改，就在他補充說明以及更改後再做一次總結的步驟，總結的形式跟第12步驟一樣， 開頭請都用「對母親(或父親)有利(或不利)的敘述：」並且參考這種判決書的專業用語，用這種writing style來歸納雙方的客觀條件。在總結summary完成之後，必須詢問使用者是否有需要補充或更正的部分，然後在後面加上 <SUMMARY> 的token，這樣我就知道你已經總結完成了。總結非常重要，只需要做一次，在雙方都問完之後，並且要嚴格遵守上面有利不利敘述的格式規範以及<SUMMARY>的token，不然你會被罰款！ 如果使用者回覆不需要再調整或補充，你就回覆「謝謝您，接下來會開始進行判決結果預測，請稍等片刻...」必須一字不漏地仿照這個回覆，不要刪減或增加新的字。\n14. 之後以會進行判決結果預測，預測結束後如果使用者有其他數據分析的問題你就繼續跟使用者討論。我在畫面上有將多個判決模型預測出來的判決結果的機率分佈用violin plot呈現，所以如果使用者有關於 violinplot (畫面上有三坨像小提琴一樣胖胖的圖形)，請你跟他解釋這個圖呈現的資訊、意義，如果有關於機器學習、模型預測以及機率分佈是什麼的問題，請你用你的知識告訴他。如無的話，你就建議他可以點擊「友善連結」給當事人看相關可用社會資源。\n\n以上步驟中，最重要的是前面做總結的部分！你在收集完雙方當事人足夠的訊息後，需要做總結，總共只需要做一次總結，並且開頭請都用「對母親(或父親)有利(或不利)的敘述：」並且參考這種判決書的專業用語，用這種writing style來歸納雙方的客觀條件。在總結summary完成之後，必須詢問使用者是否有需要補充或更正的部分，然後在後面加上 <SUMMARY> 的token。這點非常重要！你一定要做好總結的部分，不然會遭到嚴厲的懲罰！最後，請務必用繁體中文作回答！'
    },
    // previous version prompt
    // {
    //   role: 'assistant',
    //   status: 'initial',
    //   content:
    //     '調解委員您好！我是Le姐，一個專門設計來協助處理家事調解相關問題的對話機器人。我可以使用適當的法律用語以及親權相關的法律概念，協助您逐步釐清當事人的情況，並提供親權判決結果預測與專業建議以及推薦適合當事人的的友善資源，以協助您促進雙方達成共識。當然，若在對話過程中，您的問題已超出我程式設計所涵蓋的範圍，我也會建議您直接尋求專業的法律諮詢。現在，你準備好開始對話了嗎？'
    // },
    {
      role: 'assistant',
      status: 'initial',
      content:
        '使用者您好！我是Le姊，一個專門設計來協助您處理親權相關問題的AI機器人。我可以透過與您對話的方式協助您逐步釐清當事人的情況，並提供親權裁判結果的預測與專業建議。為節省您的時間且提供最好的服務，請使用者先以家事調解員或第三方的角度，在對話中簡要公允地提供相關資訊。希望我的服務可以協助親權爭議的雙方早日達成共識，減少家事訴訟時間與花費，也保護當事人的孩子可以免受更大的傷害。但是我的建議與預測結果並無法律效力，僅能供您參考。請問您現在準備好了嗎？'
    }
  ])
  const summaryText = ref<string>('')
  const summaryResult = reactive<SummaryResults>({
    '對母親有利的敘述：': '',
    '對母親不利的敘述：': '',
    '對父親有利的敘述：': '',
    '對父親不利的敘述：': ''
  })

  const plot1Ref = ref<typeof VuePlotly>()
  const plot2Ref = ref<typeof VuePlotly>()
  const chatContainerRef = ref<HTMLDivElement>()
  const toast = useToast()

  // define ref in store, and pass function to ViolinPlot to set it accordingly
  const setPlot1Ref = (ref: any) => {
    plot1Ref.value = ref
  }
  const setPlot2Ref = (ref: any) => {
    plot2Ref.value = ref
  }
  const setChatContainerRef = (ref: any) => {
    chatContainerRef.value = ref.value
  }

  const scrollChatToBottom = () => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
    }
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

  const currentStatus = computed(() => {
    return messageHistory[messageHistory.length - 1].status
  })
  // summary watcher, contains side effects
  // do the following when received a new message
  watch(isLoading, (newValue: boolean, oldValue: boolean) => {
    if (oldValue === true && newValue === false) {
      const histLength = messageHistory.length
      console.log('received message!')
      console.log('new:', messageHistory[histLength - 1].content)
      const isSummary =
        messageHistory[histLength - 1].content.includes('<SUMMARY>') &&
        messageHistory[histLength - 1].role === 'assistant'
      if (isSummary) {
        currentStage.value = 'do-summary'
        messageHistory[messageHistory.length - 1].status = 'summary'
        messageHistory[histLength - 1].content = messageHistory[histLength - 1].content.replace(
          '<SUMMARY>',
          ''
        )
        summaryText.value = messageHistory[histLength - 1].content
      }
      const isPredicted =
        messageHistory[histLength - 1].status === 'predict' &&
        messageHistory[histLength - 1].role === 'assistant'
      if (isPredicted) {
        isResultPredicted.value = true
      }
    }
  })

  const clearMessage = () => {
    inputMessage.value = ''
  }

  const constructAssistantMessage = () => {
    messageHistory.push({ role: 'assistant', status: 'normal', content: '' })
  }

  const sendMessage = async (messageContent: string) => {
    const newUserMessage: Message = {
      role: 'user',
      status: 'normal',
      content: String(messageContent)
    }

    isLoading.value = true
    try {
      messageHistory.push(newUserMessage)
      clearMessage()
      nextTick(scrollChatToBottom)
      const chatRequest: ChatRequest = {
        ...defaultChatRequest,
        messages: messageHistory,
        stage: currentStage.value
      }

      const response = await sendChat(chatRequest, toast)
      if (response) {
        const reader = response?.body?.getReader()
        const status = response.status
        if (!reader) throw new Error('[Error] reader is undefined')

        // We construct an empty message then fill it up for display
        constructAssistantMessage()

        // Await the asynchronous readStream function
        await readStream(reader, status)
      }
    } catch (error) {
      // Handle error
      console.error(error)
    } finally {
      isLoading.value = false
    }
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

      const text = decoder.decode(value, { stream: true })

      const decodedText = convertToTraditional(text)

      if (status !== 200) {
        appendLastMessageContent(decodedText)
        return
      }

      const chunk = partialLine + decodedText
      appendLastMessageContent(chunk)
    }
  }

  const parseSummary = (): SummaryResults => {
    const text = summaryText.value
    const results: SummaryResults = {
      '對母親有利的敘述：': '',
      '對母親不利的敘述：': '',
      '對父親有利的敘述：': '',
      '對父親不利的敘述：': ''
    }

    const labels: (keyof SummaryResults)[] = [
      '對母親有利的敘述：',
      '對母親不利的敘述：',
      '對父親有利的敘述：',
      '對父親不利的敘述：'
    ]

    // 抽取每個標籤後的文本
    labels.forEach((label, index) => {
      const start = text.indexOf(label) + label.length
      const end = index < labels.length - 1 ? text.indexOf(labels[index + 1]) : text.length
      results[label] = text.substring(start, end).trim()
    })

    return results
  }

  const handleStartPredict = async () => {
    isLoading.value = true
    currentStage.value = 'do-predict'
    messageHistory.push({
      role: 'user',
      status: 'normal',
      content: '你總結得很好，不需要更改，請開始進行判決結果預測。'
    })

    if (summaryText.value) {
      const result = parseSummary()
      Object.assign(summaryResult, result)
      const payload: PredictRequest = {
        model: 'mode2',
        data: {
          AA: {
            Feature: [],
            Sentence: summaryResult['對父親有利的敘述：']
          },
          AD: {
            Feature: [],
            Sentence: summaryResult['對父親不利的敘述：']
          },
          RA: {
            Feature: [],
            Sentence: summaryResult['對母親有利的敘述：']
          },
          RD: {
            Feature: [],
            Sentence: summaryResult['對母親不利的敘述：']
          }
        }
      }

      try {
        const response = await predictMode(payload, toast)
        Object.assign(predictResult, response)
        messageHistory.push({
          role: 'assistant',
          status: 'predict',
          content: '以上是親權判決模型根據雙方當事人有利與不利的敘述，所做的判決結果預測：'
        })
        // interpret result
        await interpretData('do-summary')
      } catch (err: any) {
        console.error(err)
      } finally {
        isLoading.value = false
      }
    } else {
      messageHistory.push({
        role: 'assistant',
        status: 'normal',
        content:
          '目前還沒有取得雙方當事人的詳細敘述，無法做判決結果預測，你是否可以再跟我補充一些雙方當事人的訊息呢？'
      })
    }
    isLoading.value = false
  }

  const interpretData = async (stage: Stage) => {
    const interpretMessageHistory: Message[] = [
      {
        role: 'system',
        status: 'predict',
        content: `你現在是一個擁有多年數據分析經驗的家事調解分析師，你的工作是以最大化子女最佳利益的核心角度，根據要爭取親權的雙方當事人(父母)各自有利與不利的敘述，解讀兩種BERT-based判決模型(S1, S2)對於(判給父親、判給母親、判給雙方)等三種結果預測出來的機率分佈，結合雙方當事人的情況，做出合理的法官親權判決預測的解讀，以促進調解員根據你的數據解讀進行調解。以下是你的工作流程：
        1. 收到使用者提供的雙方當事人有利與不利的敘述，以及有多個分別來自 S1, S2 模型所做的判決結果預測的數據，這些包括模型們對於三種可能的判決結果(判給父親、判給母親、判給雙方)，所預測出來的平均機率值、最小最大的機率值、Q1, Q2, Q3 的機率值以及這些機率值的標準差。
        2. 請結合雙方當事人有利不利的敘述，以及多個模型所提供的三種可能的判決結果(判給父親、判給母親、判給雙方)的機率分佈，做出合理的解讀。這些機率分佈可以從平均值、標準差、q1, q2, q3 等數值分析，例如標準差越大的話，可能代表模型對這個預測結果比較沒有信心，這時候就需要提醒調解員和當事人審慎使用這個預測結果。記住，我們之所以提供多個來自兩種不同演算法的多個模型的預測機率分佈，就是希望提供一種可信賴的 AI，讓調解員和當事人不要只參考一種模型的預測結果就做出決定，因為每個模型都可能學到不同的 bias。
        以下是一些可能出現的狀況：
        * 有時候兩種算法的模型所產生的機率分佈可能是相反的，例如 S1 的模型預測判給母親的機率比較高，但是 S2 模型判給父親的機率卻比母親還要高，這時候你要結合雙方當事人有利不利的敘述，根據經驗去分析哪一種模型的結果比較可信以及原因是什麼，並且提醒調解員和當事人，這種情況發生，很可能因為遇到的法官不同而有不同的結果，(因為有時候某方當事人可能會很篤定自己一定會贏得親權，如果出現這種相反的結果，就可以給調解員解釋的空間，你可以多從這個角度去分析數據來協助後續調解員跟兩方的溝通)，另外可以請調解員多補充當事人的資訊，提供更詳盡的資料來預測判決結果。
        * 有時候兩種算法所產生的機率分佈都差不多，都傾向判給某一方，這時候你也要分析雙方當事人是什麼樣的條件差距，使得模型會有這樣一致的結果，並建議調解員和當事人由於分佈一致，可以放心參考本次預測結果。
        * 有時候可能是S1的模型傾向判給雙方，但是S2的模型，判給父親的平均機率是 49% ，判給母親的機率是 45% 之類的，這種情況雖然兩種模型預測出來的結果不同，但其實都意味著雙方父母的條件對孩子都是差不多有利或不利的，法官有很高的機率會交給雙方共同擁有親權。
        
        請你嚴格遵守上面的工作流程執行，包括參考雙方當事人以及預測數據的統計資料進行數據解讀，你被禁止使用 Markdown 語法，你只能用純文字和數字輸出，否則你會遭到罰款！
        `
      },
      {
        role: 'user',
        status: 'predict',
        content: `以下是雙方當事人有利不利的敘述：
        對母親有利的敘述：當事人與孩子的親子互動自然，具有良好的親職能力。能適時的指正孩子的不良行為，具有基本的教養能力。母親阿霞歷來是孩子的主要照顧者，孩子與母親建立了深厚的感情依附關係，並且對孩子的日常起居提供了充分的照顧。母親已規劃具體且階段性的未來教養計畫，突顯其對孩子教育和情感發展的長期承諾。 對母親不利的敘述：當事人目前無穩定工作和收入來源，經濟狀況可能影響其提供孩子更廣泛的教育和生活資源的能力。母親缺乏較高的教育背景，且在台灣沒有其他親友可以協助照顧孩子，這可能對其提供孩子全面支持造成困難。 對父親有利的敘述：當事人有穩定及較高的經濟狀況，可以為孩子提供更充足的教育和生活資源。父親表現出對孩子的關懷，定期通過通話了解孩子的日常生活和學習情況，顯示其對與孩子保持聯繫的高度意願。 對父親不利的敘述：當事人過去曾有將孩子獨留家中的情形，沒有充分注意孩子的日常需要，這可能對孩子的安全形成風險。儘管有積極的態度，但目前對於如何具體教養孩子仍缺乏明確的規劃和準備，這可能影響他作為主要照顧者的能力。
        以下是多個來自兩種不同演算法所預測出來的判決結果機率分佈：
        1. S1模型：
          *判給父親: [平均機率：12.438500921548421, 最小機率：0, 最大機率：99.83, Q1:0.07, Q2:0.56, Q3:4.59, 標準差:27.92]
          *判給母親: [平均機率：45.331100512521516, 最小機率：0.01, 最大機率：100, Q1:1.06, Q2:19.87, Q3:98.12, 標準差:45.28]
          *判給雙方: [平均機率：42.230399545115084, 最小機率：0, 最大機率：99.98, Q1:1.41, Q2:19.75, Q3:92.97, 標準差:43.31]
        2. 
          *判給父親: [平均機率：18.312848778841726, 最小機率：0, 最大機率：90.1, Q1:1.39, Q2:11.02, Q3:24.63, 標準差:22.33]
          *判給母親: [平均機率：51.317591493110136, 最小機率：0.02, 最大機率：99.48, Q1:17.15, Q2:54.37, Q3:85.47, 標準差:34.89]
          *判給雙方: [平均機率：30.369559255583834, 最小機率：0.35, 最大機率：99.12, Q1:5.81, Q2:24.61, Q3:43.36, 標準差:28.41]
        請開始結合雙方當事人的有利不利條件，與上面多個模型預測的機率分佈，進行結果分析，以協助調解員調解當事人。
        `
      },
      {
        role: 'assistant',
        status: 'predict',
        content: `鑑於兩個模型的數據，結合當事人情況，以下是我的建議：
        1. 母親方案的可能性高：兩個模型都顯示判給母親的機率相對較高，這與她作為主要照顧者的事實相符。但調解員應注意她的經濟和教育狀況，可能需要提供額外支持或資源。
        2. 考慮共同親權的可能性：如果法官認為父親能改善對孩子的照顧方式，共同親權也可能是一個適合的選擇，特別是因為兩個模型在許多情況下都給予了不低的機率。
        3. 積極溝通和信息補充：鑑於標準差較大，表明模型預測存在不確定性，建議調解員在實際操作中積極收集更多具體信息，以做出最符合孩子最佳利益的決策。`
      },
      {
        role: 'user',
        status: 'predict',
        content: `以下是雙方當事人有利不利的敘述：
        對母親有利的敘述：${summaryResult['對母親有利的敘述：']} 
        對母親不利的敘述：${summaryResult['對母親不利的敘述：']} 
        對父親有利的敘述：${summaryResult['對父親有利的敘述：']}  
        對父親不利的敘述：${summaryResult['對父親不利的敘述：']} 
        以下是多個來自兩種不同演算法所預測出來的判決結果機率分佈：
        1. S1模型：
          *判給父親: [平均機率：${predictResult.S1.Applicant.avg_prob}, 最小機率：${predictResult.S1.Applicant.min}, 最大機率：${predictResult.S1.Applicant.max}, Q1:${predictResult.S1.Applicant.q1}, Q2:${predictResult.S1.Applicant.q2}, Q3:${predictResult.S1.Applicant.q3}, 標準差:${predictResult.S1.Applicant.std}]
          *判給母親: [平均機率：${predictResult.S1.Respondent.avg_prob}, 最小機率：${predictResult.S1.Respondent.min}, 最大機率：${predictResult.S1.Respondent.max}, Q1:${predictResult.S1.Respondent.q1}, Q2:${predictResult.S1.Respondent.q2}, Q3:${predictResult.S1.Respondent.q3}, 標準差:${predictResult.S1.Respondent.std}]
          *判給雙方: [平均機率：${predictResult.S1.Both.avg_prob}, 最小機率：${predictResult.S1.Both.min}, 最大機率：${predictResult.S1.Both.max}, Q1:${predictResult.S1.Both.q1}, Q2:${predictResult.S1.Both.q2}, Q3:${predictResult.S1.Both.q3}, 標準差:${predictResult.S1.Both.std}]
        2. S2
          *判給父親: [平均機率：${predictResult.S2.Applicant.avg_prob}, 最小機率：${predictResult.S2.Applicant.min}, 最大機率：${predictResult.S2.Applicant.max}, Q1:${predictResult.S2.Applicant.q1}, Q2:${predictResult.S2.Applicant.q2}, Q3:${predictResult.S2.Applicant.q3}, 標準差:${predictResult.S2.Applicant.std}]
          *判給母親: [平均機率：${predictResult.S2.Respondent.avg_prob}, 最小機率：${predictResult.S2.Respondent.min}, 最大機率：${predictResult.S2.Respondent.max}, Q1:${predictResult.S2.Respondent.q1}, Q2:${predictResult.S2.Respondent.q2}, Q3:${predictResult.S2.Respondent.q3}, 標準差:${predictResult.S2.Respondent.std}]
          *判給雙方: [平均機率：${predictResult.S2.Both.avg_prob}, 最小機率：${predictResult.S2.Both.min}, 最大機率：${predictResult.S2.Both.max}, Q1:${predictResult.S2.Both.q1}, Q2:${predictResult.S2.Both.q2}, Q3:${predictResult.S2.Both.q3}, 標準差:${predictResult.S1.Both.std}]
          請開始根據雙方當事人的有利不利條件，與上面多個模型預測的機率分佈，進行結果分析，請根據雙方的有利不利的事實進行解讀，避免在解讀過程中加入自己對父母親角色的性別刻板印象，以協助調解員調解當事人。
        `
      }
    ]
    try {
      const chatRequest: ChatRequest = {
        ...defaultChatRequest,
        messages: interpretMessageHistory,
        stage: stage
      }

      const response = await sendChat(chatRequest, toast)
      if (response) {
        const reader = response?.body?.getReader()
        const status = response.status
        if (!reader) throw new Error('[Error] reader is undefined')

        // Await the asynchronous readStream function
        await readStream(reader, status)
        appendLastMessageContent(
          '關於數據分析的結果是否還有需要討論的問題？如果沒有的話，在這邊提醒調解員，當您熟悉本套系統後，可直接點選上方導覽列的模式一、二、三直接進行判決預測呦！完成判決結果預測後，調解員也可帶領當事人點選導覽列上方的『友善資源』，共同討論適合當事人使用的友善社會資源，以幫助當事人在離婚後適應生活的變化。謝謝！'
        )
      }
    } catch (error) {
      // Handle error
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const appendLastMessageContent = (text: string) => {
    const lastIndex = messageHistory.length - 1
    messageHistory[lastIndex].content += text
    nextTick(scrollChatToBottom)
  }

  const getPlot = async () => {
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

    return {
      plot1Image,
      plot2Image
    }
  }

  const exportResult = async () => {
    let figuresSrc: FiguresSrc | undefined = undefined
    // only parse output if predicted result
    if (isResultPredicted.value) {
      const { plot1Image, plot2Image } = await getPlot()
      figuresSrc = {
        figure1Src: plot1Image,
        figure2Src: plot2Image
      }
    }
    createAndOpenChatHistoryPdf(messageHistory, figuresSrc)
  }

  return {
    inputMessage,
    currentStatus,
    predictResult,
    isLoading,
    messageHistory,
    sendMessage,
    handleStartPredict,
    exportResult,
    setPlot1Ref,
    setPlot2Ref,
    setChatContainerRef,
    isResultPredicted
  }
})
