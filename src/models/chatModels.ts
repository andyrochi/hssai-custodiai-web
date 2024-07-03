export interface Message {
  role: 'user' | 'assistant' | 'system'
  status: 'normal' | 'initial' | 'summary' | 'predict'
  content: string
}

export type Stage = 'collect-info' | 'do-predict' | 'do-summary'

export interface ChatRequest {
  model: string
  messages: Message[]
  stage: Stage
}

export interface ChatResponse {
  body: ReadableStream<Uint8Array> | null
  status: number
}

export interface RoleAlias {
  name: string
  src: string
}

export interface PredictResult {
  mode1: Record<string, number>
  mode2: Record<string, number>
  mode3: Record<string, number>
}

export interface ExtractResult {
  [key: string]: string
}
