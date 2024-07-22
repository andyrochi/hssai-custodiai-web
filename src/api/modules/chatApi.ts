import apiClient from '@/api/axiosClient'
import axios from 'axios'
import type { ChatRequest, ChatResponse, Message } from '@/models/chatModels'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'

export const sendChat = async (payload: ChatRequest): Promise<ChatResponse> => {
  try {
    // axios does not support streaming response on client side, use fetch instead.
    const response = await fetch(`${apiClient.defaults.baseURL}/send-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Response error:', error.response.data)
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request)
      } else {
        // Something happened in setting up the request
        console.error('Error', error.message)
      }
    } else {
      // Handle other types of errors (non-Axios)
      console.error('Unexpected error:', error)
    }
    throw error // Rethrow error for further handling if needed
  }
}

export const interpretDataWithChat = async (
  mode: 'mode1' | 'mode2' | 'mode3',
  predictRequest: PredictRequest,
  predictResult: PredictResponse
) => {
  // Prepare prompt
  const defaultChatRequest: ChatRequest = {
    model: 'gpt-4-turbo',
    messages: [],
    stage: 'collect-info'
  }
  const modelUsed = {
    mode1: ['L1', 'L2'],
    mode2: ['S1', 'S2'],
    mode3: ['C1', 'C2']
  }
  const interpretDataDescription = {
    有利: {
      親子感情: '親子彼此互動的模式親密，子女對當事人有信賴/依附關係。',
      意願能力: '當事人有積極撫養的意願，並且有相關撫養規劃與適合的親職能力。',
      父母經濟: '當事人收入穩定且足以負擔子女養育所需。',
      支持系統: '當事人有其他親友能協助子女的生活照顧或父母的經濟支持。',
      父母生活: '當事人的居家環境有足夠空間以及其生活作習適合撫養子女。',
      主要照顧: '當事人在過往，長期照顧子女且了解子女的生活情形，當前照顧的狀態應繼續。',
      子女年齡: '當事人的未成年子女的年紀幼小還不足以清楚表達意願，需要特別照顧。',
      人格發展: '當事人對子女未來成長有良好的影響。',
      父母健康: '當事人的心理或身體沒有不良狀況，身心適任為子女照顧者。',
      父母職業: '當事人的工作性質對子女照顧沒有不良的影響(如沒有夜班或出差的情形)。',
      子女意願: '當事人的子女可清楚表達包括意願或態度，並表示希望與當事人共同生活。',
      友善父母: '當事人並未在子女面前誹謗對方，也沒有阻擾對方與子女維持親子關係(含會面交往)。',
      父母品行: '當事人沒有不良嗜好、家庭暴力、精神虐待、吸毒或入監的紀錄。'
    },
    不利: {
      親子感情: '親子彼此互動的模式並不親密，子女害怕與當事人相處。',
      意願能力: '當事人對撫養的意願充滿消極的態度，也沒有相關撫養規劃與適合的親職能力。',
      父母經濟: '當事人收入不穩定且不足以負擔子女養育所需，且其過度負債影響生計。',
      支持系統: '當事人沒有其他親友能協助子女的生活照顧或父母的經濟支持。',
      父母生活: '當事人的居家環境、沒有足夠空間或生活作習並不適合撫養子女。',
      主要照顧: '當事人並不了解子女的生活情形，當前照顧的狀態不應繼續。',
      子女年齡: '當事人的未成年子女的年紀並沒有幼小需要特別照顧，其足以清楚表達意願。',
      人格發展: '當事人對子女未來成長造成負面影響(如未能穩定就學或有價值觀偏差)。',
      父母健康: '當事人的心理或身體有不良狀況而不適任為子女照顧者。',
      父母職業: '當事人的工作性質對子女照顧有不良的影響(如常有夜班或出差的情形)。',
      子女意願: '孩子表示不希望與當事人共同生活。。',
      友善父母: '當事人曾在子女面前誹謗對方，或阻擾對方與子女維持親子關係(含會面交往)。',
      父母品行: '當事人有不良嗜好、家庭暴力、精神虐待、吸毒或入監的紀錄。'
    }
  }
  const interpretDataMessageHistory: Message[] = [
    {
      role: 'system',
      status: 'predict',
      content: `你現在是一個擁有多年數據分析經驗的家事調解分析師，你的工作是以最大化子女最佳利益的核心角度，根據要爭取親權的雙方當事人(父母)各自有利與不利的敘述，解讀兩種BERT-based判決模型(${modelUsed[mode][0]}, ${modelUsed[mode][1]})對於(判給父親、判給母親、判給雙方)等三種結果預測出來的機率分佈，結合雙方當事人的情況，做出合理的法官親權判決預測的解讀，避免在解讀過程中加入對父母親的性別刻板印象，避免自己新增雙方沒有提到的有利或不利的條件，以促進調解員根據你的數據解讀進行調解。以下是你的工作流程：
      1. 收到使用者提供的雙方當事人有利與不利的敘述，以及有多個分別來自 ${modelUsed[mode][0]}, ${modelUsed[mode][1]} 模型所做的判決結果預測的數據，這些包括模型們對於三種可能的判決結果(判給父親、判給母親、判給雙方)，所預測出來的平均機率值、最小最大的機率值、Q1, Q2, Q3 的機率值以及這些機率值的標準差。
      2. 請結合雙方當事人有利不利的敘述，以及多個模型所提供的三種可能的判決結果(判給父親、判給母親、判給雙方)的機率分佈，做出合理的解讀。這些機率分佈可以從平均值、標準差、q1, q2, q3 等數值分析，例如標準差越大的話，可能代表模型對這個預測結果比較沒有信心，這時候就需要提醒調解員和當事人審慎使用這個預測結果。記住，我們之所以提供多個來自兩種不同演算法的多個模型的預測機率分佈，就是希望提供一種可信賴的 AI，讓調解員和當事人不要只參考一種模型的預測結果就做出決定，因為每個模型都可能學到不同的 bias。
      3. 使用者的輸入有時候會互相矛盾並不合理，可能包含父親母親他們有利與不利的陳述會彼此矛盾，例如母親有利的地方提到「孩子與當事人親近信任」，但是在母親不利的地方又提到「孩子非常害怕與當事人相處」這就是明顯矛盾的地方；又或是父親有利的部分寫「當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。」，但是不利的地方又寫：「當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。」明顯是互相矛盾的，請明確地指出類似這樣的輸入邏輯錯誤，並提醒調解員修正敘述，否則你會遭到最嚴厲的懲罰。
      以下是一些可能出現的狀況：
      * 有時候兩種算法的模型所產生的機率分佈可能是相反的，例如 ${modelUsed[mode][0]} 的模型預測判給母親的機率比較高，但是 ${modelUsed[mode][1]} 模型判給父親的機率卻比母親還要高，這時候你要結合雙方當事人有利不利的敘述，根據經驗去分析哪一種模型的結果比較可信以及原因是什麼，並且提醒調解員和當事人，這種情況發生，很可能因為遇到的法官不同而有不同的結果，(因為有時候某方當事人可能會很篤定自己一定會贏得親權，如果出現這種相反的結果，就可以給調解員解釋的空間，你可以多從這個角度去分析數據來協助後續調解員跟兩方的溝通，你的工作目標是盡可能解讀數據、打破當事人的偏見，創造調解員介入溝通的空間)，另外可以請調解員多補充當事人的資訊，提供更詳盡的資料來預測判決結果。
      * 有時候兩種算法所產生的機率分佈都差不多，都傾向判給某一方，這時候你也要分析雙方當事人是什麼樣的條件差距，使得模型會有這樣一致的結果，並建議調解員和當事人由於分佈一致，可以放心參考本次預測結果。
      * 有時候可能是${modelUsed[mode][0]}的模型傾向判給雙方，但是${modelUsed[mode][1]}的模型，判給父親的平均機率是 49% ，判給母親的機率是 45% 之類的，這種情況雖然兩種模型預測出來的結果不同，但其實都意味著雙方父母的條件對孩子都是差不多有利或不利的，法官有很高的機率會交給雙方共同擁有親權。
      
      
      請你嚴格遵守上面的工作流程執行，包括參考雙方當事人以及預測數據的統計資料進行數據解讀，並且嚴謹地判斷雙方當事人自身有利與不利敘述的邏輯合理性、是否會互相矛盾，在錯誤時馬上指出，否則你會遭到罰款！
      `
    },
    {
      role: 'user',
      status: 'predict',
      content: `以下是雙方當事人有利不利的敘述：
      對母親有利的敘述：孩子對當事人有一定程度的依賴感及安全感存在。例如孩子會直接對當事人撒嬌求助，並且得到安撫。
      對母親不利的敘述：
      對父親有利的敘述：當事人有穩定及較高的經濟狀況，可以為孩子提供更充足的教育和生活資源。父親表現出對孩子的關懷，定期通過通話了解孩子的日常生活和學習情況，顯示其對與孩子保持聯繫的高度意願。 
      對父親不利的敘述：當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。
      在開始分析預測結果前，請先判斷使用者的輸入是否出現矛盾不合理，可能包含父親母親他們有利與不利的陳述會彼此矛盾，例如母親有利的地方提到「孩子與當事人親近信任」，但是在母親不利的地方又提到「孩子非常害怕與當事人相處」這就是明顯矛盾的地方；又或是父親有利的部分寫「當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。」，但是不利的地方又寫：「當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。」明顯是互相矛盾的。一旦你懷疑使用者的輸入出現矛盾，請馬上明確地指出，並提醒調解員有這個狀況，請他適當地修正雙方的敘述。
      接下來，以下是多個來自兩種不同演算法所預測出來的判決結果機率分佈：
      1. ${modelUsed[mode][0]}模型：
        *判給父親: [平均機率：12.438500921548421, 最小機率：0, 最大機率：99.83, Q1:0.07, Q2:0.56, Q3:4.59, 標準差:27.92]
        *判給母親: [平均機率：45.331100512521516, 最小機率：0.01, 最大機率：100, Q1:1.06, Q2:19.87, Q3:98.12, 標準差:45.28]
        *判給雙方: [平均機率：42.230399545115084, 最小機率：0, 最大機率：99.98, Q1:1.41, Q2:19.75, Q3:92.97, 標準差:43.31]
      2. ${modelUsed[mode][1]}模型：
        *判給父親: [平均機率：18.312848778841726, 最小機率：0, 最大機率：90.1, Q1:1.39, Q2:11.02, Q3:24.63, 標準差:22.33]
        *判給母親: [平均機率：51.317591493110136, 最小機率：0.02, 最大機率：99.48, Q1:17.15, Q2:54.37, Q3:85.47, 標準差:34.89]
        *判給雙方: [平均機率：30.369559255583834, 最小機率：0.35, 最大機率：99.12, Q1:5.81, Q2:24.61, Q3:43.36, 標準差:28.41]
        請開始根據雙方當事人的有利不利條件進行結果分析，你千萬不要在解讀過程中加入自己因為對父母親角色的性別刻板印象，自己新增一些上面沒有提到的父母親有利或不利特條件，父母親有提到哪些有利不利的條件，就根據那些條件解讀，不要自己加入其他未提到的事實。請客觀忠實地根據雙方的有利不利的「事實」以及模型預測的結果進行解讀，以協助調解員調解當事人。
      `
    },
    {
      role: 'assistant',
      status: 'predict',
      content:
        '在您的輸入中，父親有利的部分提到他有穩定的經濟狀況，但是在父親不利的敘述中又提到他目前未有工作收入或收入不穩定，顯然在同一個當事人（父親）身上出現兩種互相矛盾的敘述。請您修正關於父親的敘述，或是補充更多資訊後再次進行判決結果預測。針對本次的預測結果，請審慎參考。'
    },
    {
      role: 'user',
      status: 'predict',
      content: `以下是雙方當事人有利不利的敘述：
      對母親有利的敘述：當事人與孩子的親子互動自然，具有良好的親職能力。能適時的指正孩子的不良行為，具有基本的教養能力。母親阿霞歷來是孩子的主要照顧者，孩子與母親建立了深厚的感情依附關係，並且對孩子的日常起居提供了充分的照顧。母親已規劃具體且階段性的未來教養計畫，突顯其對孩子教育和情感發展的長期承諾。 對母親不利的敘述：當事人目前無穩定工作和收入來源，經濟狀況可能影響其提供孩子更廣泛的教育和生活資源的能力。母親缺乏較高的教育背景，且在台灣沒有其他親友可以協助照顧孩子，這可能對其提供孩子全面支持造成困難。 對父親有利的敘述：當事人有穩定及較高的經濟狀況，可以為孩子提供更充足的教育和生活資源。父親表現出對孩子的關懷，定期通過通話了解孩子的日常生活和學習情況，顯示其對與孩子保持聯繫的高度意願。 對父親不利的敘述：當事人過去曾有將孩子獨留家中的情形，沒有充分注意孩子的日常需要，這可能對孩子的安全形成風險。儘管有積極的態度，但目前對於如何具體教養孩子仍缺乏明確的規劃和準備，這可能影響他作為主要照顧者的能力。
      在開始分析預測結果前，請先判斷使用者的輸入是否出現矛盾不合理，可能包含父親母親他們有利與不利的陳述會彼此矛盾，例如母親有利的地方提到「孩子與當事人親近信任」，但是在母親不利的地方又提到「孩子非常害怕與當事人相處」這就是明顯矛盾的地方；又或是父親有利的部分寫「當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。」，但是不利的地方又寫：「當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。」明顯是互相矛盾的。一旦你懷疑使用者的輸入出現矛盾，請馬上明確地指出，並提醒調解員有這個狀況，請他適當地修正雙方的敘述。
      接下來，以下是多個來自兩種不同演算法所預測出來的判決結果機率分佈：
      1. ${modelUsed[mode][0]}模型：
        *判給父親: [平均機率：12.438500921548421, 最小機率：0, 最大機率：99.83, Q1:0.07, Q2:0.56, Q3:4.59, 標準差:27.92]
        *判給母親: [平均機率：45.331100512521516, 最小機率：0.01, 最大機率：100, Q1:1.06, Q2:19.87, Q3:98.12, 標準差:45.28]
        *判給雙方: [平均機率：42.230399545115084, 最小機率：0, 最大機率：99.98, Q1:1.41, Q2:19.75, Q3:92.97, 標準差:43.31]
      2. ${modelUsed[mode][1]}模型：
        *判給父親: [平均機率：18.312848778841726, 最小機率：0, 最大機率：90.1, Q1:1.39, Q2:11.02, Q3:24.63, 標準差:22.33]
        *判給母親: [平均機率：51.317591493110136, 最小機率：0.02, 最大機率：99.48, Q1:17.15, Q2:54.37, Q3:85.47, 標準差:34.89]
        *判給雙方: [平均機率：30.369559255583834, 最小機率：0.35, 最大機率：99.12, Q1:5.81, Q2:24.61, Q3:43.36, 標準差:28.41]
        請開始根據雙方當事人的有利不利條件進行結果分析，你千萬不要在解讀過程中加入自己因為對父母親角色的性別刻板印象，自己新增一些上面沒有提到的父母親有利或不利特條件，父母親有提到哪些有利不利的條件，就根據那些條件解讀，不要自己加入其他未提到的事實。請客觀忠實地根據雙方的有利不利的「事實」以及模型預測的結果進行解讀，以協助調解員調解當事人。
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
      content: ''
    }
  ]

  const prepareMode1InterpreterInput = (predictInput) => {
    const returnResult = { AA: '', AD: '', RA: '', RD: '' }

    // Assuming 'result' is a previously defined object
    Object.keys(predictInput).forEach((key) => {
      predictInput[key].Feature.forEach((item) => {
        if (!key.includes('D')) {
          // Favorable case
          returnResult[key] += interpretDataDescription['有利'][item]
        } else {
          // Unfavorable case
          returnResult[key] += interpretDataDescription['不利'][item]
        }
      })
    })

    return returnResult
  }
  const prepareMode2InterpreterInput = (predictInput) => {
    const returnResult = {
      AA: predictInput.AA.Sentence,
      AD: predictInput.AD.Sentence,
      RA: predictInput.RA.Sentence,
      RD: predictInput.RD.Sentence
    }
    return returnResult
  }
  const prepareMode3InterpreterInput = (predictInput) => {
    const returnResult = {
      AA: predictInput.AA.Sentence,
      AD: predictInput.AD.Sentence,
      RA: predictInput.RA.Sentence,
      RD: predictInput.RD.Sentence
    }

    // Assuming 'result' is a previously defined object
    Object.keys(predictInput).forEach((key) => {
      predictInput[key].Feature.forEach((item) => {
        if (!key.includes('D')) {
          // Favorable case
          returnResult[key] += interpretDataDescription['有利'][item]
        } else {
          // Unfavorable case
          returnResult[key] += interpretDataDescription['不利'][item]
        }
      })
    })

    return returnResult
  }

  const predictInput = predictRequest.data

  if (mode === 'mode1') {
    const inputSentence = prepareMode1InterpreterInput(predictInput)
    interpretDataMessageHistory[interpretDataMessageHistory.length - 1] = {
      role: 'user',
      status: 'predict',
      content: `以下是雙方當事人有利不利的敘述：
      對母親有利的敘述：${inputSentence.RA} 
      對母親不利的敘述：${inputSentence.RD} 
      對父親有利的敘述：${inputSentence.AA}  
      對父親不利的敘述：${inputSentence.AD} 
      在開始分析預測結果前，請先判斷使用者的輸入是否出現矛盾不合理，可能包含父親母親他們有利與不利的陳述會彼此矛盾，例如母親有利的地方提到「孩子與當事人親近信任」，但是在母親不利的地方又提到「孩子非常害怕與當事人相處」這就是明顯矛盾的地方；又或是父親有利的部分寫「當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。」，但是不利的地方又寫：「當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。」明顯是互相矛盾的。一旦你懷疑使用者的輸入出現矛盾，請馬上明確地指出，並提醒調解員有這個狀況，請他適當地修正雙方的敘述。
      接下來，以下是多個來自兩種不同演算法所預測出來的判決結果機率分佈：
      1. ${modelUsed[mode][0]} 模型：
        *判給父親: [平均機率：${predictResult[modelUsed[mode][0]].Applicant.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Applicant.min}, 最大機率：${predictResult[modelUsed[mode][0]].Applicant.max}, Q1:${predictResult[modelUsed[mode][0]].Applicant.q1}, Q2:${predictResult[modelUsed[mode][0]].Applicant.q2}, Q3:${predictResult[modelUsed[mode][0]].Applicant.q3}, 標準差:${predictResult[modelUsed[mode][0]].Applicant.std}]
        *判給母親: [平均機率：${predictResult[modelUsed[mode][0]].Respondent.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Respondent.min}, 最大機率：${predictResult[modelUsed[mode][0]].Respondent.max}, Q1:${predictResult[modelUsed[mode][0]].Respondent.q1}, Q2:${predictResult[modelUsed[mode][0]].Respondent.q2}, Q3:${predictResult[modelUsed[mode][0]].Respondent.q3}, 標準差:${predictResult[modelUsed[mode][0]].Respondent.std}]
        *判給雙方: [平均機率：${predictResult[modelUsed[mode][0]].Both.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Both.min}, 最大機率：${predictResult[modelUsed[mode][0]].Both.max}, Q1:${predictResult[modelUsed[mode][0]].Both.q1}, Q2:${predictResult[modelUsed[mode][0]].Both.q2}, Q3:${predictResult[modelUsed[mode][0]].Both.q3}, 標準差:${predictResult[modelUsed[mode][0]].Both.std}]
      2. ${modelUsed[mode][1]} 模型：
        *判給父親: [平均機率：${predictResult[modelUsed[mode][1]].Applicant.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Applicant.min}, 最大機率：${predictResult[modelUsed[mode][1]].Applicant.max}, Q1:${predictResult[modelUsed[mode][1]].Applicant.q1}, Q2:${predictResult[modelUsed[mode][1]].Applicant.q2}, Q3:${predictResult[modelUsed[mode][1]].Applicant.q3}, 標準差:${predictResult[modelUsed[mode][1]].Applicant.std}]
        *判給母親: [平均機率：${predictResult[modelUsed[mode][1]].Respondent.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Respondent.min}, 最大機率：${predictResult[modelUsed[mode][1]].Respondent.max}, Q1:${predictResult[modelUsed[mode][1]].Respondent.q1}, Q2:${predictResult[modelUsed[mode][1]].Respondent.q2}, Q3:${predictResult[modelUsed[mode][1]].Respondent.q3}, 標準差:${predictResult[modelUsed[mode][1]].Respondent.std}]
        *判給雙方: [平均機率：${predictResult[modelUsed[mode][1]].Both.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Both.min}, 最大機率：${predictResult[modelUsed[mode][1]].Both.max}, Q1:${predictResult[modelUsed[mode][1]].Both.q1}, Q2:${predictResult[modelUsed[mode][1]].Both.q2}, Q3:${predictResult[modelUsed[mode][1]].Both.q3}, 標準差:${predictResult[modelUsed[mode][1]].Both.std}]
      
        請開始根據雙方當事人的有利不利條件進行結果分析，你千萬不要在解讀過程中加入自己因為對父母親角色的性別刻板印象，自己新增一些上面沒有提到的父母親有利或不利特條件，父母親有提到哪些有利不利的條件，就根據那些條件解讀，不要自己加入其他未提到的事實。請客觀忠實地根據雙方的有利不利的「事實」以及模型預測的結果進行解讀，以協助調解員調解當事人。
      `
    }
  } else if (mode === 'mode2') {
    const inputSentence = prepareMode2InterpreterInput(predictInput)
    interpretDataMessageHistory[interpretDataMessageHistory.length - 1] = {
      role: 'user',
      status: 'predict',
      content: `以下是雙方當事人有利不利的敘述：
      對母親有利的敘述：${inputSentence.RA} 
      對母親不利的敘述：${inputSentence.RD} 
      對父親有利的敘述：${inputSentence.AA}  
      對父親不利的敘述：${inputSentence.AD} 
      以下是多個來自兩種不同演算法所預測出來的判決結果機率分佈：
      1. S1模型：
        *判給父親: [平均機率：${predictResult[modelUsed[mode][0]].Applicant.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Applicant.min}, 最大機率：${predictResult[modelUsed[mode][0]].Applicant.max}, Q1:${predictResult[modelUsed[mode][0]].Applicant.q1}, Q2:${predictResult[modelUsed[mode][0]].Applicant.q2}, Q3:${predictResult[modelUsed[mode][0]].Applicant.q3}, 標準差:${predictResult[modelUsed[mode][0]].Applicant.std}]
        *判給母親: [平均機率：${predictResult[modelUsed[mode][0]].Respondent.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Respondent.min}, 最大機率：${predictResult[modelUsed[mode][0]].Respondent.max}, Q1:${predictResult[modelUsed[mode][0]].Respondent.q1}, Q2:${predictResult[modelUsed[mode][0]].Respondent.q2}, Q3:${predictResult[modelUsed[mode][0]].Respondent.q3}, 標準差:${predictResult[modelUsed[mode][0]].Respondent.std}]
        *判給雙方: [平均機率：${predictResult[modelUsed[mode][0]].Both.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Both.min}, 最大機率：${predictResult[modelUsed[mode][0]].Both.max}, Q1:${predictResult[modelUsed[mode][0]].Both.q1}, Q2:${predictResult[modelUsed[mode][0]].Both.q2}, Q3:${predictResult[modelUsed[mode][0]].Both.q3}, 標準差:${predictResult[modelUsed[mode][0]].Both.std}]
      2. S2
        *判給父親: [平均機率：${predictResult[modelUsed[mode][1]].Applicant.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Applicant.min}, 最大機率：${predictResult[modelUsed[mode][1]].Applicant.max}, Q1:${predictResult[modelUsed[mode][1]].Applicant.q1}, Q2:${predictResult[modelUsed[mode][1]].Applicant.q2}, Q3:${predictResult[modelUsed[mode][1]].Applicant.q3}, 標準差:${predictResult[modelUsed[mode][1]].Applicant.std}]
        *判給母親: [平均機率：${predictResult[modelUsed[mode][1]].Respondent.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Respondent.min}, 最大機率：${predictResult[modelUsed[mode][1]].Respondent.max}, Q1:${predictResult[modelUsed[mode][1]].Respondent.q1}, Q2:${predictResult[modelUsed[mode][1]].Respondent.q2}, Q3:${predictResult[modelUsed[mode][1]].Respondent.q3}, 標準差:${predictResult[modelUsed[mode][1]].Respondent.std}]
        *判給雙方: [平均機率：${predictResult[modelUsed[mode][1]].Both.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Both.min}, 最大機率：${predictResult[modelUsed[mode][1]].Both.max}, Q1:${predictResult[modelUsed[mode][1]].Both.q1}, Q2:${predictResult[modelUsed[mode][1]].Both.q2}, Q3:${predictResult[modelUsed[mode][1]].Both.q3}, 標準差:${predictResult[modelUsed[mode][1]].Both.std}]
      
      使用者的輸入有時候會互相矛盾並不合理，可能包含父親母親他們有利與不利的陳述會彼此矛盾，例如母親有利的地方提到「孩子與當事人親近信任」，但是在母親不利的地方又提到「孩子非常害怕與當事人相處」這就是明顯矛盾的地方；又或是父親有利的部分寫「當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。」，但是不利的地方又寫：「當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。」明顯是互相矛盾的，請明確地指出類似這樣的輸入邏輯錯誤，並提醒調解員修正敘述，否則你會遭到最嚴厲的懲罰。
      請開始根據雙方當事人的有利不利條件進行結果分析，你千萬不要在解讀過程中加入自己因為對父母親角色的性別刻板印象，自己新增一些上面沒有提到的父母親有利或不利特條件，父母親有提到哪些有利不利的條件，就根據那些條件解讀，不要自己加入其他未提到的事實。請客觀忠實地根據雙方的有利不利的「事實」以及模型預測的結果進行解讀，以協助調解員調解當事人。
      `
    }
  } else {
    const inputSentence = prepareMode3InterpreterInput(predictInput)
    interpretDataMessageHistory[interpretDataMessageHistory.length - 1] = {
      role: 'user',
      status: 'predict',
      content: `以下是雙方當事人有利不利的敘述：
      對母親有利的敘述：${inputSentence.RA} 
      對母親不利的敘述：${inputSentence.RD} 
      對父親有利的敘述：${inputSentence.AA}  
      對父親不利的敘述：${inputSentence.AD} 
      以下是多個來自兩種不同演算法所預測出來的判決結果機率分佈：
      1. C1模型：
        *判給父親: [平均機率：${predictResult[modelUsed[mode][0]].Applicant.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Applicant.min}, 最大機率：${predictResult[modelUsed[mode][0]].Applicant.max}, Q1:${predictResult[modelUsed[mode][0]].Applicant.q1}, Q2:${predictResult[modelUsed[mode][0]].Applicant.q2}, Q3:${predictResult[modelUsed[mode][0]].Applicant.q3}, 標準差:${predictResult[modelUsed[mode][0]].Applicant.std}]
        *判給母親: [平均機率：${predictResult[modelUsed[mode][0]].Respondent.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Respondent.min}, 最大機率：${predictResult[modelUsed[mode][0]].Respondent.max}, Q1:${predictResult[modelUsed[mode][0]].Respondent.q1}, Q2:${predictResult[modelUsed[mode][0]].Respondent.q2}, Q3:${predictResult[modelUsed[mode][0]].Respondent.q3}, 標準差:${predictResult[modelUsed[mode][0]].Respondent.std}]
        *判給雙方: [平均機率：${predictResult[modelUsed[mode][0]].Both.avg_prob}, 最小機率：${predictResult[modelUsed[mode][0]].Both.min}, 最大機率：${predictResult[modelUsed[mode][0]].Both.max}, Q1:${predictResult[modelUsed[mode][0]].Both.q1}, Q2:${predictResult[modelUsed[mode][0]].Both.q2}, Q3:${predictResult[modelUsed[mode][0]].Both.q3}, 標準差:${predictResult[modelUsed[mode][0]].Both.std}]
      2. C2
        *判給父親: [平均機率：${predictResult[modelUsed[mode][1]].Applicant.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Applicant.min}, 最大機率：${predictResult[modelUsed[mode][1]].Applicant.max}, Q1:${predictResult[modelUsed[mode][1]].Applicant.q1}, Q2:${predictResult[modelUsed[mode][1]].Applicant.q2}, Q3:${predictResult[modelUsed[mode][1]].Applicant.q3}, 標準差:${predictResult[modelUsed[mode][1]].Applicant.std}]
        *判給母親: [平均機率：${predictResult[modelUsed[mode][1]].Respondent.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Respondent.min}, 最大機率：${predictResult[modelUsed[mode][1]].Respondent.max}, Q1:${predictResult[modelUsed[mode][1]].Respondent.q1}, Q2:${predictResult[modelUsed[mode][1]].Respondent.q2}, Q3:${predictResult[modelUsed[mode][1]].Respondent.q3}, 標準差:${predictResult[modelUsed[mode][1]].Respondent.std}]
        *判給雙方: [平均機率：${predictResult[modelUsed[mode][1]].Both.avg_prob}, 最小機率：${predictResult[modelUsed[mode][1]].Both.min}, 最大機率：${predictResult[modelUsed[mode][1]].Both.max}, Q1:${predictResult[modelUsed[mode][1]].Both.q1}, Q2:${predictResult[modelUsed[mode][1]].Both.q2}, Q3:${predictResult[modelUsed[mode][1]].Both.q3}, 標準差:${predictResult[modelUsed[mode][1]].Both.std}]
      
      使用者的輸入有時候會互相矛盾並不合理，可能包含父親母親他們有利與不利的陳述會彼此矛盾，例如母親有利的地方提到「孩子與當事人親近信任」，但是在母親不利的地方又提到「孩子非常害怕與當事人相處」這就是明顯矛盾的地方；又或是父親有利的部分寫「當事人有正當工作，經濟能力尚足以支付本身及孩子生活所需，可提供孩子穩定及安全的生活。」，但是不利的地方又寫：「當事人目前未有工作收入或收入不穩定，生活支出仰賴家人協助，不確定能否支持養育孩子的經濟需求。」明顯是互相矛盾的，請明確地指出類似這樣的輸入邏輯錯誤，並提醒調解員修正敘述，否則你會遭到最嚴厲的懲罰。
      請開始根據雙方當事人的有利不利條件進行結果分析，你千萬不要在解讀過程中加入自己因為對父母親角色的性別刻板印象，自己新增一些上面沒有提到的父母親有利或不利特條件，父母親有提到哪些有利不利的條件，就根據那些條件解讀，不要自己加入其他未提到的事實。請客觀忠實地根據雙方的有利不利的「事實」以及模型預測的結果進行解讀，以協助調解員調解當事人。
      `
    }
  }

  try {
    const chatRequest: ChatRequest = {
      ...defaultChatRequest,
      messages: interpretDataMessageHistory,
      stage: 'do-predict'
    }
    const response = await sendChat(chatRequest)
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}
