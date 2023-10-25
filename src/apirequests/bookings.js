import axios from 'axios'
require('dotenv').config();
const baseUrl = process.env.BASE_URL;

export const addBooking = async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/addbooking`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const getBooking = async (bookingId) => {
    try {
      const response = await axios.get(`${baseUrl}/booking/${bookingId}`)
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
      const response = await axios.patch(`${baseUrl}/updatebooking/${bookingId}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const deleteBooking = async (bookingId) => {
    try {
      const response = await axios.delete(`${baseUrl}/deletebooking/${bookingId}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }