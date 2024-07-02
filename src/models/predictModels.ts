export interface PredictRequest {
  model: string /* TODO: attribute should be fixed to [mode] in future */
  data: {
    AA: {
      Feature: string[]
      Sentence: string
    }
    AD: {
      Feature: string[]
      Sentence: string
    }
    RA: {
      Feature: string[]
      Sentence: string
    }
    RD: {
      Feature: string[]
      Sentence: string
    }
  }
}

interface ProbabilityStats {
  all_probs: number[]
  avg_prob: number
  max: number
  min: number
  q1: number
  q2: number
  q3: number
  std: number
}

interface ModelData {
  Applicant: ProbabilityStats
  Both: ProbabilityStats
  Respondent: ProbabilityStats
}

export interface PredictResponse {
  [modelName: string]: ModelData
}
