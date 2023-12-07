import axios from 'axios'

import { baseURL as apiUrl } from './config'
const baseUrl = apiUrl;


const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getAccessToken = () => {
  return sessionStorage.getItem('accessToken')
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

export const getAllPublicTypes = async () => {
  try {
    const response = await api.get('/public-data_types')
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
