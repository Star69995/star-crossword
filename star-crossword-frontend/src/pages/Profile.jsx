// pages/Profile.jsx
import React, { useState } from 'react'
import { useAuth } from '../providers/AuthContext'
import { updateProfile, changePassword } from '../services/api'

const Profile = () => {
    const { user, updateUser } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || ''
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const updatedUser = await updateProfile(profileData)
            updateUser(updatedUser)
            setMessage('הפרופיל עודכן בהצלחה')
        } catch (error) {
            setError('שגיאה בעדכון הפרופיל')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('הסיסמאות אינן תואמות')
            setLoading(false)
            return
        }

        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword)
            setMessage('הסיסמה שונתה בהצלחה')
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            setError('שגיאה בשינוי הסיסמה')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle fs-3 me-3"></i>
                                <div>
                                    <h2 className="card-title mb-0">פרופיל משתמש</h2>
                                    <small className="opacity-75">{user?.email}</small>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-0">
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        פרטים אישיים
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('password')}
                                    >
                                        שינוי סיסמה
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('stats')}
                                    >
                                        סטטיסטיקות
                                    </button>
                                </li>
                            </ul>

                            <div className="p-4">
                                {message && (
                                    <div className="alert alert-success" role="alert">
                                        {message}
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <form onSubmit={handleProfileSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">שם מלא</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">אימייל</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                required
                                                dir="ltr"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="bio" className="form-label">אודותיי</label>
                                            <textarea
                                                className="form-control"
                                                id="bio"
                                                rows="4"
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                placeholder="ספר קצת על עצמך..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    שומר...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    שמור שינויים
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {activeTab === 'password' && (
                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="currentPassword" className="form-label">סיסמה נוכחית</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="newPassword" className="form-label">סיסמה חדשה</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                required
                                                minLength="6"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="confirmPassword" className="form-label">אישור סיסמה חדשה</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    משנה...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-shield-check me-2"></i>
                                                    שנה סיסמה
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {activeTab === 'stats' && (
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="card bg-light">
                                                <div className="card-body text-center">
                                                    <i className="bi bi-puzzle fs-1 text-primary"></i>
                                                    <h4 className="mt-2">{user?.stats?.crosswordsCreated || 0}</h4>
                                                    <p className="text-muted mb-0">תשבצים שיצרתי</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-light">
                                                <div className="card-body text-center">
                                                    <i className="bi bi-list-ul fs-1 text-success"></i>
                                                    <h4 className="mt-2">{user?.stats?.wordListsCreated || 0}</h4>
                                                    <p className="text-muted mb-0">רשימות מילים שיצרתי</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-light">
                                                <div className="card-body text-center">
                                                    <i className="bi bi-heart-fill fs-1 text-danger"></i>
                                                    <h4 className="mt-2">{user?.stats?.likesReceived || 0}</h4>
                                                    <p className="text-muted mb-0">לייקים שקיבלתי</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-light">
                                                <div className="card-body text-center">
                                                    <i className="bi bi-trophy fs-1 text-warning"></i>
                                                    <h4 className="mt-2">{user?.stats?.crosswordsSolved || 0}</h4>
                                                    <p className="text-muted mb-0">תשבצים שפתרתי</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile