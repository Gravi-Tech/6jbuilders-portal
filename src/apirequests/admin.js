import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'

export const login = async (accountNumber, password) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, { accountNumber, password })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const addAdmin = async (adminData, accessToken) => {
  try {
    const response = await axios.post(`${baseUrl}/admins`, adminData, {
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

export const getAdmin = async (adminId, accessToken) => {
  try {
    const response = await axios.get(`${baseUrl}/admins/${adminId}`, {
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

export const getAllAdmins = async (accessToken) => {
  try {
    const response = await axios.get(`${baseUrl}/admins`, {
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

export const updateAdmin = async (adminId, updatedAdminData, accessToken) => {
  try {
    const response = await axios.put(`${baseUrl}/admins/${adminId}`, updatedAdminData, {
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
