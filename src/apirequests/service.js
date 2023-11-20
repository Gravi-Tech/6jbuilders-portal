import axios from 'axios'
require('dotenv').config()
const baseUrl = process.env.BASE_URL || 'http://localhost:3000/api'

export const addService = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/services`, data)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getService = async (serviceId) => {
  try {
    const response = await axios.get(`${baseUrl}/services/${serviceId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAllServices = async () => {
  try {
    const response = await axios.get(`${baseUrl}/services`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateService = async (serviceId, data) => {
  try {
    const response = await axios.put(`${baseUrl}/services/${serviceId}`, data)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(`${baseUrl}/services/${serviceId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
