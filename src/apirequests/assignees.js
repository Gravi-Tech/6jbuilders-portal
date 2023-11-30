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

export const addAssigneeByTaskId = async (taskId, data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post(
      `/tasks/${taskId}/assignees`,
      { assignees: data },
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

export const getAssigneesByTaskId = async (taskId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.get(`/tasks/${taskId}/assignees`, {
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

export const updateAssigneesByTaskId = async (taskId, data) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.put(
      `/tasks/${taskId}/assignees`,
      { worker_id: data },
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

// DO NOT USE
export const deleteAssigneeById = async (assigneeId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`/assignees/${assigneeId}`, {
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

export const deleteTaskAssigneesById = async (taskId) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.delete(`/tasks/${taskId}/assignees`, {
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
