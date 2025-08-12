import axios from 'axios'

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000/api'


const api = axios.create({
    baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers["auth-token"] = token;
    }
    return config
})

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('error: ', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth endpoints
export const register = async (userData) => {
    const response = await api.post('/users/', userData)
    return response.data
}

export const login = async (email, password) => {
    const response = await api.post('/login/', { email, password })
    return response.data
}

export const getCurrentUser = async () => {
    const response = await api.get('/users/me')
    return response.data.user
}

export const updateProfile = async (userId, profileData) => {
    const response = await api.patch(`/users/${userId}`, profileData)
    return response.data
}

// Crossword endpoints
export const getCrosswords = async () => {
    const response = await api.get('/crosswords')
    return response.data.crosswords
}

export const getCrosswordById = async (id) => {
    const response = await api.get(`/crosswords/${id}`)
    return response.data.crossword
}

export const getMyCrosswords = async () => {
    const response = await api.get('/crosswords/my-crosswords')
    return response.data.crosswords
}

export const createCrossword = async (crosswordData) => {
    const response = await api.post('/crosswords/', crosswordData)
    return response.data
}

export const updateCrossword = async (id, crosswordData) => {
    const response = await api.put(`/crosswords/${id}`, crosswordData)
    return response.data
}

export const deleteCrossword = async (id) => {
    const response = await api.delete(`/crosswords/${id}`)
    return response.data
}

export const toggleLikeCrossword = async (id) => {
    const response = await api.patch(`/crosswords/${id}/like`)
    return response.data
}

export const markCrosswordSolved = async (id) => {
    const response = await api.put(`/crosswords/${id}/solved`)
    return response.data
}

export const unmarkCrosswordSolved = async (id) => {
    const response = await api.delete(`/crosswords/${id}/solved`)
    return response.data
}

export const updateCrosswordVisibility = async (id, isPublic) => {
    const response = await api.patch(`/crosswords/${id}/visibility`, { isPublic })
    return response.data
}

// Word list endpoints
export const createWordList = async (wordListData) => {
    const response = await api.post('/wordLists', wordListData)
    return response.data
}

export const getWordLists = async () => {
    const response = await api.get('/wordLists')
    return response.data.wordlists
}

export const getWordListById = async (id) => {
    const response = await api.get(`/wordLists/${id}`)
    return response.data.wordlist
}

export const getMyWordLists = async () => {
    const response = await api.get('/wordLists/my-wordLists')
    return response.data.wordlists
}

export const updateWordList = async (id, wordListData) => {
    const response = await api.put(`/wordLists/${id}`, wordListData)
    return response.data
}

export const deleteWordList = async (id) => {
    // This endpoint doesn't exist in your API, you might need to add it
    const response = await api.delete(`/wordLists/${id}`)
    return response.data
}

// Like endpoints for word lists
export const toggleLikeWordList = async (id) => {
    const response = await api.patch(`/wordLists/${id}/like`)
    return response.data
}

// Password change (if this endpoint exists)
export const changePassword = async (currentPassword, newPassword) => {
    // This endpoint doesn't exist in your API, you might need to add it
    const response = await api.patch('/users/password', {
        currentPassword,
        newPassword
    })
    return response.data
}

export default api