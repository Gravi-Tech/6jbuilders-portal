import axios from 'axios'
require('dotenv').config();
const baseUrl = process.env.BASE_URL;

export const createProject = async (projectData) => {
    try {
      const response = await axios.post(`${baseUrl}/projects`, projectData)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const getProject = async (projectId) => {
    try {
      const response = await axios.get(`${baseUrl}/projects/${projectId}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const updateProject = async (projectId, updatedData) => {
    try {
      const response = await axios.put(`${baseUrl}/projects/${projectId}`, updatedData)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const deleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`${baseUrl}/projects/${projectId}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }