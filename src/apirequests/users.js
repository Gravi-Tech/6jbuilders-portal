import axios from 'axios'
require('dotenv').config();
const baseUrl = process.env.BASE_URL;

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, userData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${baseUrl}/users/${userId}`, updatedData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${baseUrl}/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getJson = async (data) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    console.log('🚀 ~ file: users.js:5 ~ getUsers ~ response:', response)
    return response.json()
  } catch (error) {
    console.log('🚀 ~ file: users.js:9 ~ getUsers ~ error:', error)
  }
}

export const getAdminSettings = async () => {
  try {
    const response = await axios.get(`${baseUrl}/admin/settings`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateAdminSettings = async (updatedData) => {
  try {
    const response = await axios.put(`${baseUrl}/admin/settings`, updatedData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
