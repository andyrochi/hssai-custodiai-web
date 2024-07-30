import apiClient from '@/api/axiosClient'
import type { PredictRequest, PredictResponse } from '@/models/predictModels'
import axios from 'axios'

export const predictMode = async (
  payload: PredictRequest,
  toast?: any
): Promise<PredictResponse> => {
  try {
    const response = await apiClient.post<PredictResponse>('/intermediate-predict', payload, {
      timeout: 5000
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Response error:', error.response.data)
        toast?.add({
          severity: 'error',
          summary: '出現問題',
          detail: `看來出現了一點問題，請稍後再嘗試或是聯絡管理員。錯誤如下:${error}`,
          life: 5000
        })
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request)
        toast?.add({
          severity: 'error',
          summary: '出現問題',
          detail: `並未取得回覆，請稍後再嘗試或是聯絡管理員。錯誤如下:${error}`,
          life: 5000
        })
      } else {
        // Something happened in setting up the request
        console.error('Error', error.message)
        toast?.add({
          severity: 'error',
          summary: '出現問題',
          detail: `發生問題，請稍後再嘗試或是聯絡管理員。錯誤如下:${error}`,
          life: 5000
        })
      }
    } else {
      // Handle other types of errors (non-Axios)
      console.error('Unexpected error:', error)
      toast?.add({
        severity: 'error',
        summary: '出現問題',
        detail: `發生未知的問題，請稍後再嘗試或是聯絡管理員。錯誤如下:${error}`,
        life: 5000
      })
    }
    throw error // Rethrow error for further handling if needed
  }
}
