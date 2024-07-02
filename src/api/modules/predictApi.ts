import apiClient from '@/api/axiosClient'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'
import axios from 'axios'

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
