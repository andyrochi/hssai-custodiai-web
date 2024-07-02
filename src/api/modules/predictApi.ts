import apiClient from '@/api/axiosClient'
import axios from 'axios'

interface PredictRequest {
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

interface PredictResponse {
  [modelName: string]: ModelData
}

export const predictMode = async (payload: PredictRequest): Promise<PredictResponse> => {
  try {
    const response = await apiClient.post<PredictResponse>('/intermediate-predict', payload)
    return response.data
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
