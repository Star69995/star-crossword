import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData);
                } else {
                    localStorage.removeItem('token');
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await apiLogin(email, password);
            localStorage.setItem('token', response.token);

            // fetch the full user data immediately
            const userData = await getCurrentUser();
            setUser(userData);

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            await apiRegister(userData);

            // reuse login flow to ensure token + user are set correctly
            return await login(userData.email, userData.password);

        } catch (error) {
            let errorMessage = "Registration failed";

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message; // from backend
            } else if (error.message) {
                errorMessage = error.message; // general error
            }

            console.error("Registration error:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};