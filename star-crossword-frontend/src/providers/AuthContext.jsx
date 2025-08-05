// providers/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                const userData = await getCurrentUser()
                setUser(userData)
            }
        } catch (error) {
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const response = await apiLogin(email, password)
        localStorage.setItem('token', response.token)
        setUser(response.user)
        return response
    }

    const register = async (userData) => {
        const response = await apiRegister(userData)
        localStorage.setItem('token', response.token)
        setUser(response.user)
        return response
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser)
    }

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}