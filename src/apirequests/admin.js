import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const login = async (accountNumber, password) => {
  try {
    const response = await api.post(`${baseUrl}/login`, { accountNumber, password })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const addAdmin = async (adminData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post(`${baseUrl}/admins`, adminData, {
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

export const getAdmin = async (adminId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`${baseUrl}/admins/${adminId}`, {
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

export const getAllAdmins = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`${baseUrl}/admins`, {
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

export const updateAdmin = async (adminId, updatedAdminData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`${baseUrl}/admins/${adminId}`, updatedAdminData, {
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

export const checkAccountNumber = async (accountNumber) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `${baseUrl}/admins/checkAccountNumber`,
      { accountNumber },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Failed to check account number:', error)
    throw error
  }
}
