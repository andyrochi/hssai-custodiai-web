import apiClient from '@/api/axiosClient'
import axios from 'axios'
import type { ChatRequest, ChatResponse } from '@/models/chatModels'

export const sendChat = async (payload: ChatRequest): Promise<ChatResponse> => {
  try {
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
