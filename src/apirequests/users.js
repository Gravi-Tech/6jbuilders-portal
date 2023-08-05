import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'
export const getUsers = async () => {
    try {
        const  response = await axios.get(`${baseUrl}/users`)
        console.log("🚀 ~ file: users.js:5 ~ getUsers ~ response:", response)
        return response.data
    } catch (error) {
        console.log("🚀 ~ file: users.js:9 ~ getUsers ~ error:", error)
    }
}

export const addUser = async (data) => {
    try {
        const  response = await axios.post(`${baseUrl}/users`, data)
        console.log("🚀 ~ file: users.js:5 ~ getUsers ~ response:", response)
        return response.data
    } catch (error) {
        console.log("🚀 ~ file: users.js:9 ~ getUsers ~ error:", error)
    }
}

export const getJson = async (data) => {
    try {
        const  response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        console.log("🚀 ~ file: users.js:5 ~ getUsers ~ response:", response)
        return response.json()
    } catch (error) {
        console.log("🚀 ~ file: users.js:9 ~ getUsers ~ error:", error)
    }
}