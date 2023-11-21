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

export const addService = async (data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/services', data, {
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

export const getService = async (serviceId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/services/${serviceId}`, {
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

export const getAllServices = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/services', {
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

export const getPublicServices = async () => {
  try {
    const response = await api.get('/public/services')
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateService = async (serviceId, data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`/services/${serviceId}`, data, {
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

export const updateServiceStatus = async (serviceId, status) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `/services/${serviceId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteService = async (serviceId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`/services/${serviceId}`, {
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
