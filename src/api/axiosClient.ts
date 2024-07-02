import axios from 'axios'

const apiClient = axios.create({
  // TODO: use dotenv
  baseURL: 'https://hssai-custodiAI.phys.nthu.edu.tw/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
