import axios from 'axios'
require('dotenv').config();
const baseUrl = process.env.BASE_URL;

export const createWorker = async (workerData) => {
  try {
    const response = await axios.post(`${baseUrl}/workers`, workerData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getWorker = async (workerId) => {
  try {
    const response = await axios.get(`${baseUrl}/workers/${workerId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateWorker = async (workerId, updatedData) => {
  try {
    const response = await axios.put(`${baseUrl}/workers/${workerId}`, updatedData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteWorker = async (workerId) => {
  try {
    const response = await axios.delete(`${baseUrl}/workers/${workerId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
