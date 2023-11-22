import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'

export const addBooking = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/bookings`, data)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getBooking = async (bookingId) => {
  try {
    const response = await axios.get(`${baseUrl}/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${baseUrl}/bookings`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateBooking = async (bookingId, data) => {
  try {
    const response = await axios.put(`${baseUrl}/bookings/${bookingId}`, data)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${baseUrl}/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
