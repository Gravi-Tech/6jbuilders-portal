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

export const addReason = async (data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/reasons', data, {
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

export const getReasonById = async (reasonId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/reasons/${reasonId}`, {
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

export const getAllReason = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/reasons', {
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

export const updateReason = async (reasonId, data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`/reasons/${reasonId}`, data, {
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

export const deleteReason = async (reasonId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`/reasons/${reasonId}`, {
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
