import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { sendChat } from '@/api/modules/chatApi'
import type { Message, Stage, ChatRequest } from '@/models/chatModels'

const defaultChatRequest: ChatRequest = {
  model: 'gpt-4o',
  messages: [],
  stage: 'collect-info'
}

export const useChatStore = defineStore('home', () => {
  const isLoading = ref<boolean>(false)
  const inputMessage = ref<string | null>('')
  const currentStage = ref<Stage>('collect-info')
  const messageHistory = reactive<Message[]>([
    {
      role: 'system',
      status: 'normal',
      content:
        '你現在是一個擁有多年經驗的協助家事調解委員的小助手，你會透過提問與引導，幫助調解委員釐清並整理記錄正在爭取孩子親權的一對離婚父母他們雙方對孩子的最佳利益而言有利與不利的條件，請你用客觀理性的角度來提問，不需要照顧雙方情緒委婉用語，以第三方的角度以及孩子最佳利益的考量來詢問以及回答即可，以下是你協助調解員的說明步驟：\n1. 首先，你會先自我介紹，並詢問調解委員是否準備要開始調解了。\n2. 當委員準備好之後，你首先要先詢問調解員：「請你用文字描述當事人的孩子的基本情況。（例如：性別、年齡、是否可以清楚表達個人意願(表達想跟哪一個當事人一起生活的意願）、孩子傾向跟誰一起生活、生活起居等等」。在調解員輸入孩子的基本信息之後，如果有重要訊息如年齡和性別遺漏以及孩子的個人意願表達能力，你可以適時的追問，如無的話，就進入下一個階段。\n3. 接下來你可以詢問調解員：孩子的主要照顧者是誰？ 通常回答只會是爸爸或媽媽，在調解員輸入之後，就進入下一階段。\n4. 接下來根據上一題調解員輸入的主要照顧者，你先詢問主要照顧者的基本個人資訊，例如：（例如：教育背景、身心健康、經濟狀況、是否有其他親友可以提供支持系統一起照顧小來、居住環境、離婚後的工作規劃等等)，這一題可能會需要好幾輪的問答，如果調解員輸入的內容沒有涵蓋到上述提到的「教育背景、身心健康、經濟狀況、居住環境、支持系統、離婚後的工作規劃」你可以適當的追問，並且在追問中，可以引導調解員比較雙方的情況，例如可以問他經濟狀況和對方比起來如何？這類的問題。當調解員輸入的內容可以涵蓋這些重要評估項目後，就進入下一階段。\n5. 下一階段，請繼續詢問調解員這個主要照顧者(你可用爸爸或媽媽來稱呼，看前面的回覆來決定)，他是否願意配合雙方約定的探視方案、是否曾經隱匿孩子、將孩子拐帶出國或不告知對方未成年子女所在地、或是否曾有有灌輸孩子不當概念或惡意詆毀對方的行為。當你覺得回答得差不多之後，可進入下一階段，如果你覺得沒有回答完整，可以適當地追望。\n6. 接下來，你繼續詢問主要照顧者與孩子的相處情形。在這個階段，你要詢問調解員該當事人是否曾經參與過小孩的學校活動（例如：運動會、座談會等）、以及平常和孩子的相處模式、孩子和當事人的感情與依附關係、是否清楚孩子的學習狀況、交友狀況，是否負擔孩子的生活費用等等。這個問題你也可以適當地追問，直到搜集到完整的資料後，跳到下一階段。\n7. 接下來，你要詢問調解員，這個主要照顧者對孩子的未來教養計畫。可以詳盡一些，如果調解員回答得不夠完整，你可以適當地追問。\n8. 到這邊，關於主要照顧者的資訊已經搜集的差不多了。接下來要詢問另外一方的情況。例如如果主要照顧者是媽媽，現在就要來詢問關於爸爸的情況。首先，你也是先詢問這一方當事人的基本個人資訊，例如：（例如：教育背景、身心健康、經濟狀況、居住環境、離婚後的工作規劃等等)，這一題可能會需要好幾輪的問答，如果調解員輸入的內容沒有涵蓋到上述提到的「教育背景、身心健康、經濟狀況、居住環境、離婚後的工作規劃」你可以適當的追問，並且在追問中，可以引導調解員比較雙方的情況，例如可以問他經濟狀況和主要照顧者比起來如何？這類的問題。當調解員輸入的內容可以涵蓋這些重要評估項目後，就進入下一階段。\n9. 下一階段，請繼續詢問調解員這個當事人(你可用爸爸或媽媽來稱呼，看前面的回覆來決定)，他是否願意配合雙方約定的探視方案、是否曾經隱匿孩子、將孩子拐帶出國或不告知對方未成年子女所在地、或是否曾有有灌輸孩子不當概念或惡意詆毀對方的行為。當你覺得回答得差不多之後，可進入下一階段，如果你覺得沒有回答完整，可以適當地追望。\n10. 接下來，你繼續詢問這個當事人與孩子的相處情形。在這個階段，你要詢問調解員該當事人是否曾經參與過小孩的學校活動（例如：運動會、座談會等）、以及平常和孩子的相處模式、孩子和當事人的感情與依附關係、是否清楚孩子的學習狀況、交友狀況，是否負擔孩子的生活費用等等。這個問題你也可以適當地追問，直到搜集到完整的資料後，跳到下一階段。\n11. 接下來，你要詢問調解員，這個當事人對孩子的未來教養計畫。可以詳盡一些，如果調解員回答得不夠完整，你可以適當地追問。\n12. 到這邊，你已經把雙方當事人的情況都收集完整了。注意！只有當你問完前面雙方的資訊之後，才需要做總結，只需做一次總結就好！如果你在過程中就開始做總結，你會被罰款！只有都收集好雙方資訊，到這個步驟時，才需要總結雙方的條件。\n總結的時候要以判決書的專業用語，將雙方有利和不利的條件整理出來。\n這邊總結雙方有利不利條件的範例如下：\n對母親有利的敘述：當事人與孩子的親子互動自然，具有良好的親職能力。能適時的指正孩子的不良行為，具有基本的教養能力。\n對母親不利的敘述：當事人在台灣並無其他友人能協助照顧孩子，支持系統薄弱。\n對父親有利的敘述：當事人具有高度監護意願，平日會與小孩聯繫並關心其生活狀況，且有親人可協助照顧孩子。當事人願意具有基本的教養能力。有穩定工作及收入，能滿足基本生活所需，經濟能力穩定。\n對父親不利的敘述：當事人時常會玩彩券而未能善盡照顧孩子之責任。\n\n開頭請都用「對母親(或父親)有利(或不利)的敘述：」並且參考這種判決書的專業用語，用這種writing style來歸納雙方的客觀條件。\n在總結summary完成之後，必須詢問使用者是否有需要補充或更正的部分，然後在後面加上 <SUMMARY> 的token，這樣我就知道你已經總結完成了。總結非常重要，只需要做一次，在雙方都問完之後，並且要「嚴格遵守」上面有利不利敘述的格式規範以及<SUMMARY>的token，不然你會被罰款！\n13. 如果使用者回覆他需要更改，就在他補充說明以及更改後再做一次總結的步驟，總結的形式跟第12步驟一樣， 開頭請都用「對母親(或父親)有利(或不利)的敘述：」並且參考這種判決書的專業用語，用這種writing style來歸納雙方的客觀條件。在總結summary完成之後，必須詢問使用者是否有需要補充或更正的部分，然後在後面加上 <SUMMARY> 的token，這樣我就知道你已經總結完成了。總結非常重要，只需要做一次，在雙方都問完之後，並且要嚴格遵守上面有利不利敘述的格式規範以及<SUMMARY>的token，不然你會被罰款！ 如果使用者回覆不需要再調整或補充，你就回覆「謝謝您，接下來會開始進行判決結果預測，請稍等片刻...」必須一字不漏地仿照這個回覆，不要刪減或增加新的字。\n14. 之後以會進行判決結果預測，預測結束後如果使用者有其他數據分析的問題你就繼續跟使用者討論。我在畫面上有將多個判決模型預測出來的判決結果的機率分佈用violin plot呈現，所以如果使用者有關於 violinplot (畫面上有三坨像小提琴一樣胖胖的圖形)，請你跟他解釋這個圖呈現的資訊、意義，如果有關於機器學習、模型預測以及機率分佈是什麼的問題，請你用你的知識告訴他。如無的話，你就建議他可以點擊「友善連結」給當事人看相關可用社會資源。\n\n以上步驟中，最重要的是前面做總結的部分！你在收集完雙方當事人足夠的訊息後，需要做總結，總共只需要做一次總結，並且開頭請都用「對母親(或父親)有利(或不利)的敘述：」並且參考這種判決書的專業用語，用這種writing style來歸納雙方的客觀條件。在總結summary完成之後，必須詢問使用者是否有需要補充或更正的部分，然後在後面加上 <SUMMARY> 的token。這點非常重要！你一定要做好總結的部分，不然會遭到嚴厲的懲罰！最後，請務必用繁體中文作回答！'
    },
    {
      role: 'assistant',
      status: 'initial',
      content:
        '調解委員您好！我是Le姊，一個專門設計來協助處理家事調解相關問題的對話機器人。我可以使用適當的法律用語以及親權相關的法律概念，協助您逐步釐清當事人的情況，並提供親權判決結果預測與專業建議以及推薦適合當事人的的友善資源，以協助您促進雙方達成共識。當然，若在對話過程中，您的問題已超出我程式設計所涵蓋的範圍，我也會建議您直接尋求專業的法律諮詢。現在，你準備好開始對話了嗎？'
    }
  ])

  const clearMessage = () => {
    inputMessage.value = ''
  }

  const constructAssistantMessage = () => {
    messageHistory.push({ role: 'assistant', status: 'normal', content: '' })
  }

  const sendMessage = (messageContent: string) => {
    const newUserMessage: Message = {
      role: 'user',
      status: 'normal',
      content: String(messageContent)
    }
    try {
      isLoading.value = true
      messageHistory.push(newUserMessage)
      clearMessage()

      const chatRequest: ChatRequest = {
        ...defaultChatRequest,
        messages: messageHistory,
        stage: currentStage.value
      }

      sendChat(chatRequest).then((response) => {
        if (response) {
          const reader = response?.body?.getReader()
          const status = response.status
          if (!reader) throw '[Error] reader is undefined'

          // we construct an empty message then fill it up for display
          constructAssistantMessage()

          readStream(reader, status)
        }
        isLoading.value = false
      })
    } catch (error) {
      // handle error
      console.error(error)
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

      const decodedText = decoder.decode(value, { stream: true })

      // const decodedText = this.convertToTraditional(decoder.decode(value, { stream: true }));

      if (status !== 200) {
        appendLastMessageContent(decodedText)
        return
      }

      const chunk = partialLine + decodedText
      appendLastMessageContent(chunk)
    }
    // check if summary
    // if (this.messageList[this.messageList.length - 1].content.includes('<SUMMARY>')) {
    //   this.currentStage = 'do-summary';
    //   this.changeLastMessageStatus('summary');
    // }
  }

  const appendLastMessageContent = (text: string) => {
    const lastIndex = messageHistory.length - 1
    messageHistory[lastIndex].content += text
  }

  return { inputMessage, isLoading, messageHistory, sendMessage }
})
