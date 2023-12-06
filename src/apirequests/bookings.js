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

export const addBooking = async (data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/bookings', data, {
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

export const getBookingById = async (bookingId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/bookings/${bookingId}`, {
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

export const getAllBooking = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/bookings', {
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

export const updateBooking = async (bookingId, data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`/bookings/${bookingId}`, data, {
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

export const rejectBooking = async (bookingId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `/bookings/${bookingId}/reject`,
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

export const deleteBooking = async (bookingId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`/bookings/${bookingId}`, {
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


export const checkBookingStatus = async (taskId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/bookings/${taskId}/status`, {
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
