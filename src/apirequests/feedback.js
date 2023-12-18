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

export const addFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/feedbacks', feedbackData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getFeedback = async (feedbackId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/feedbacks/${feedbackId}`, {
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

export const getAllFeedbacks = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/feedbacks', {
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

export const getAllPublicFeedbacks = async () => {
  try {
    const response = await api.get('/public-feedbacks')
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateFeedback = async (feedbakcId, updatedData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`${baseUrl}/feedbacks/${feedbakcId}`, updatedData, {
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

export const deleteFeedback = async (feedbackId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`${baseUrl}/feedbacks/${feedbackId}`, {
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

export const postFeedbackAsTestimonial = async (feedbackId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `${baseUrl}/feedbacks/${feedbackId}/post-testimonial`,
      {},
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
