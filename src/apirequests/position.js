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

export const createPosition = async (workerData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/positions', workerData, {
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
    const response = await api.get(`/positions/${workerId}`, {
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

export const getAllPositions = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/positions', {
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

export const updatePosition = async (positionId, updatedData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`${baseUrl}/positions/${positionId}`, updatedData, {
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

export const deletePosition = async (positionId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`${baseUrl}/positions/${positionId}`, {
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
