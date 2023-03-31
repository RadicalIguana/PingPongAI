import axios from 'axios'

// const HOST = 'localhost'
// const PORT = '8000'
// const HOST = '192.168.0.7'
// For Docker
// const HOST = '0.0.0.0'
const HOST = 'php'
const PORT = '8000'
const DOCKER = '/api'

const axiosClient = axios.create({
    // baseURL: `http://${HOST}:${PORT}/api`
    baseURL : DOCKER
    // baseURL: 'http://localhost:8000/api'
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN')
    config.headers.Authorization = `Bearer ${token}`
    return config;
})
  

axiosClient.interceptors.response.use((response) => {
    return response
}, (error) => {
    const {response} = error
    if (response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN')
    }
    throw error
})

export default axiosClient