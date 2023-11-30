import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getAccessToken = () => {
  return sessionStorage.getItem('accessToken')
}

export const addTask = async (data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post('/tasks', data, {
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

export const getTaskById = async (taskId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/tasks/${taskId}`, {
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

export const getAllTask = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get('/tasks', {
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

export const updateTask = async (taskId, data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(`/tasks/${taskId}`, data, {
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

export const updateTaskIsVisited = async (taskId, isVisited) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `/tasks/${taskId}/visited`,
      { isVisited },
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

export const deleteTask = async (taskId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`/tasks/${taskId}`, {
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

export const checkTaskStatus = async (taskId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/tasks/${taskId}/status`, {
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

export const cancelTask = async (taskId, reasonId, otherReason) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `/tasks/${taskId}/cancel`,
      { reasonId, otherReason },
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

export const completeTask = async (taskId, totalAmount) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `/tasks/${taskId}/complete`,
      { total_amount: totalAmount },
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
