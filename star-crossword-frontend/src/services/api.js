import axios from 'axios'
import MakeGrid from '../utils/MakeGrid'

const API_BASE_URL = import.meta.env.VITE_API_URL

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
    (response) => {
        if (response.data && typeof response.data === 'object') {
            // Handle wordList endpoints (both singular and plural)
            if (response.config.url?.includes('/wordList')) {
                if (!response.data.wordlists) {
                    response.data.wordlists = [];
                }
                if (!response.data.wordlist) {
                    response.data.wordlist = null;
                }
            }

            // Handle crossword endpoints (both singular and plural)
            if (response.config.url?.includes('/crossword')) {
                if (!response.data.crosswords) {
                    response.data.crosswords = [];
                }
                if (!response.data.crossword) {
                    response.data.crossword = null;
                }
            }

            // Handle user endpoints
            if (response.config.url?.includes('/user')) {
                if (!response.data.users) {
                    response.data.users = [];
                }
                if (!response.data.user) {
                    response.data.user = null;
                }
            }
        }

        return response;
    },
    (error) => {
        // Handle 404s as empty responses for list endpoints
        if (error.response?.status === 404) {
            const url = error.config.url;

            // For list endpoints, return empty array instead of error
            if (url?.includes('/wordLists') || url?.includes('my-wordLists')) {
                return {
                    data: {
                        message: 'No word lists found',
                        wordlists: []
                    }
                };
            }

            if (url?.includes('/crosswords') || url?.includes('my-crosswords')) {
                return {
                    data: {
                        message: 'No crosswords found',
                        crosswords: []
                    }
                };
            }

            // For single item endpoints, you might want to let the 404 through
            // or handle it differently
        }

        // Handle unauthorized
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
    // for each list retrieve the words with api call and connect them to one list
    const words = [];
    for (const wordList of crosswordData.wordListIds) {
        const response = await getWordListById(wordList);
        words.push(...response.words);
    }

    const GridData = MakeGrid({
       
        size: crosswordData.size,
        maxWords: crosswordData.maxWords,
        definitionsList: words
    });
 console.log('GridData: ', GridData);
    const crossword = {
        title: crosswordData.title,
        description: crosswordData.description,
        isPublic: crosswordData.isPublic,
        crosswordObject: { gridData:  GridData  } 
        
    }

    const response = await api.post('/crosswords/', crossword)
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