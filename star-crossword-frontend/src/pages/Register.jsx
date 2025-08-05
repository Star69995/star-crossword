// pages/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthContext'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('הסיסמאות אינן תואמות')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('הסיסמה חייבת להכיל לפחות 6 תווים')
            setLoading(false)
            return
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            navigate('/')
        } catch (error) {
            setError('שגיאה בהרשמה. נסה שוב.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-person-plus-fill fs-1 text-primary"></i>
                                <h2 className="card-title">הרשמה</h2>
                                <p className="text-muted">צור חשבון חדש</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">שם מלא</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">אימייל</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">סיסמה</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                    />
                                    <div className="form-text">לפחות 6 תווים</div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">אישור סיסמה</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            נרשם...
                                        </>
                                    ) : (
                                        'הירשם'
                                    )}
                                </button>
                            </form>

                            <div className="text-center">
                                <p className="mb-0">יש לך כבר חשבון? <Link to="/login" className="text-decoration-none">התחבר</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register