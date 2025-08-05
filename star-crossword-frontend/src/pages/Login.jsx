// pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthContext'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await login(formData.email, formData.password)
            navigate('/')
        } catch (error) {
            setError('שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.')
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
                                <i className="bi bi-person-circle fs-1 text-primary"></i>
                                <h2 className="card-title">התחברות</h2>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
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

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">סיסמה</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
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
                                            מתחבר...
                                        </>
                                    ) : (
                                        'התחבר'
                                    )}
                                </button>
                            </form>

                            <div className="text-center">
                                <p className="mb-0">אין לך חשבון? <Link to="/register" className="text-decoration-none">הירשם עכשיו</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login