import axios from 'axios'
require('dotenv').config();
const baseUrl = process.env.BASE_URL;

export const createMaterial = async (materialData) => {
    try {
      const response = await axios.post(`${baseUrl}/materials`, materialData)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const getMaterial = async (materialId) => {
    try {
      const response = await axios.get(`${baseUrl}/materials/${materialId}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const updateMaterial = async (materialId, updatedData) => {
    try {
      const response = await axios.put(`${baseUrl}/materials/${materialId}`, updatedData)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  
  export const deleteMaterial = async (materialId) => {
    try {
      const response = await axios.delete(`${baseUrl}/materials/${materialId}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }