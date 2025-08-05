// pages/CrosswordCreator.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyWordLists, createCrossword } from '../services/api'

const CrosswordCreator = () => {
    const navigate = useNavigate()
    const [wordLists, setWordLists] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'medium',
        size: 15,
        wordListIds: [],
        isPublic: false
    })

    useEffect(() => {
        fetchWordLists()
    }, [])

    const fetchWordLists = async () => {
        try {
            const data = await getMyWordLists()
            setWordLists(data)
        } catch (error) {
            console.error('Error fetching word lists:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (formData.wordListIds.length === 0) {
            setError('יש לבחור לפחות רשימת מילים אחת')
            setLoading(false)
            return
        }

        try {
            await createCrossword(formData)
            navigate('/my-crosswords')
        } catch (error) {
            setError('שגיאה ביצירת התשבץ')
        } finally {
            setLoading(false)
        }
    }

    const handleWordListToggle = (wordListId) => {
        setFormData(prev => ({
            ...prev,
            wordListIds: prev.wordListIds.includes(wordListId)
                ? prev.wordListIds.filter(id => id !== wordListId)
                : [...prev.wordListIds, wordListId]
        }))
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="card-title mb-0">יצירת תשבץ חדש</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">כותרת התשבץ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">תיאור (אופציונלי)</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="difficulty" className="form-label">רמת קושי</label>
                                        <select
                                            className="form-select"
                                            id="difficulty"
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        >
                                            <option value="easy">קל</option>
                                            <option value="medium">בינוני</option>
                                            <option value="hard">קשה</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="size" className="form-label">גודל הלוח</label>
                                        <select
                                            className="form-select"
                                            id="size"
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) })}
                                        >
                                            <option value={13}>13x13</option>
                                            <option value={15}>15x15</option>
                                            <option value={17}>17x17</option>
                                            <option value={21}>21x21</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">בחר רשימות מילים</label>
                                    {wordLists.length === 0 ? (
                                        <div className="alert alert-info">
                                            <p className="mb-2">אין לך רשימות מילים עדיין.</p>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={() => navigate('/create-wordlist')}
                                            >
                                                צור רשימת מילים חדשה
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {wordLists.map(wordList => (
                                                <div key={wordList.id} className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`wordlist-${wordList.id}`}
                                                        checked={formData.wordListIds.includes(wordList.id)}
                                                        onChange={() => handleWordListToggle(wordList.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`wordlist-${wordList.id}`}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="fw-bold">{wordList.name}</span>
                                                            <small className="text-muted">{wordList.wordsCount} מילים</small>
                                                        </div>
                                                        {wordList.description && (
                                                            <small className="text-muted d-block">{wordList.description}</small>
                                                        )}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isPublic"
                                            checked={formData.isPublic}
                                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="isPublic">
                                            תשבץ ציבורי (אחרים יוכלו לראות ולפתור את התשבץ)
                                        </label>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !formData.title.trim() || formData.wordListIds.length === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                יוצר תשבץ...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle me-2"></i>
                                                צור תשבץ
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/my-crosswords')}
                                    >
                                        ביטול
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CrosswordCreator