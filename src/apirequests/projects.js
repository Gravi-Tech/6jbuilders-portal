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
  return localStorage.getItem('accessToken')
}

export const createProject = async (projectData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/projects', projectData, {
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

export const fileUpload = async (formData) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.post('/file-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
