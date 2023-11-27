import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const createWorker = async (workerData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/workers', workerData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getWorker = async (workerId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/workers/${workerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAllWorkers = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/workers', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateWorker = async (workerId, updatedData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`${baseUrl}/workers/${workerId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteWorker = async (workerId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`${baseUrl}/workers/${workerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
