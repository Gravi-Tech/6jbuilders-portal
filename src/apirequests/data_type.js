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

export const addType = async (data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/data_types', data, {
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

export const getType = async (typeId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/data_types/${typeId}`, {
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

export const getAllTypes = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/data_types', {
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

export const updateType = async (typeId, data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`/data_types/${typeId}`, data, {
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

export const deleteType = async (typeId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`/data_types/${typeId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
