import axios from 'axios'
import { API_ROOT } from 'utilities/constant'

export const updateBoard = async (id, data) => {
    const request = await axios.put(`${API_ROOT}/board/${id}`, data)
    return request.data
}

export const fetchBoardDetails = async(id) => {
    const request = await axios.get(`${API_ROOT}/board/${id}`)
    return request.data
}
export const createNewColumn = async (data) => {
    const request = await axios.post(`${API_ROOT}/column`, data)
    return request.data
}
export const createNewCard = async (data) => {
    const request =await axios.post(`${API_ROOT}/card`, data)
    return request.data
}
export const updateColumn= async (id, data) => {
    const request =await axios.put(`${API_ROOT}/column/${id}`, data)
    return request.data
}

export const updateCard = async (id, data) => {
    const request =await axios.put(`${API_ROOT}/card/${id}`, data)
    return request.data
}