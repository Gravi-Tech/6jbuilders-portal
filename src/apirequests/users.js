import axios from 'axios'
import { baseURL as apiUrl } from './config'
const baseUrl = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const userLogin = async (mobile_number, password) => {
  try {
    const response = await api.post(`${baseUrl}/users/login`, { mobile_number, password })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const createUser = async (userData) => {
  try {
    const response = await api.post(`${baseUrl}/users`, userData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getUser = async (userId) => {
  try {
    const response = await api.get(`${baseUrl}/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const response = await api.get(`${baseUrl}/users`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await api.put(`${baseUrl}/users/${userId}`, updatedData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`${baseUrl}/users/${userId}`)
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
    const response = await api.get(`${baseUrl}/admin/settings`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateAdminSettings = async (updatedData) => {
  try {
    const response = await api.put(`${baseUrl}/admin/settings`, updatedData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
