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

export const createProject = async (projectData) => {
  try {
    const accessToken = getAccessToken()
    const response = await api.post(
      `${baseUrl}/projects`,
      { data: projectData },
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
