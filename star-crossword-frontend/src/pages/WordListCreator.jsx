// pages/WordListCreator.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWordList } from '../services/api'

const WordListCreator = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        words: [],
        isPublic: false
    })
    const [wordsText, setWordsText] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const words = parseWordsFromText(wordsText)
            if (words.length === 0) {
                setError('יש להוסיף לפחות מילה אחת')
                setLoading(false)
                return
            }

            await createWordList({
                ...formData,
                words: words
            })
            navigate('/my-wordlists')
        } catch (error) {
            setError('שגיאה ביצירת רשימת המילים')
        } finally {
            setLoading(false)
        }
    }

    const parseWordsFromText = (text) => {
        const lines = text.split('\n').filter(line => line.trim())
        return lines.map(line => {
            const parts = line.split('|').map(part => part.trim())
            return {
                word: parts[0] || '',
                definition: parts[1] || '',
                category: parts[2] || ''
            }
        }).filter(item => item.word)
    }

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setWordsText(event.target.result)
            }
            reader.readAsText(file, 'UTF-8')
        }
    }

    const handleExport = () => {
        const words = parseWordsFromText(wordsText)
        const exportText = words.map(word =>
            `${word.word}|${word.definition}|${word.category}`
        ).join('\n')

        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formData.name || 'רשימת-מילים'}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="card-title mb-0">יצירת רשימת מילים חדשה</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">שם הרשימה</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label htmlFor="words" className="form-label mb-0">מילים</label>
                                        <div className="btn-group btn-group-sm">
                                            <input
                                                type="file"
                                                className="d-none"
                                                id="import-file"
                                                accept=".txt"
                                                onChange={handleImport}
                                            />
                                            <label htmlFor="import-file" className="btn btn-outline-secondary">
                                                <i className="bi bi-upload me-1"></i>יבא
                                            </label>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleExport}
                                                disabled={!wordsText.trim()}
                                            >
                                                <i className="bi bi-download me-1"></i>יצא
                                            </button>
                                        </div>
                                    </div>
                                    <textarea
                                        className="form-control font-monospace"
                                        id="words"
                                        rows="12"
                                        placeholder=" מילה|הגדרה|קטגוריה
                                    דוגמה|משהו שמסביר או מדגים|כללי
                                    תשבץ|משחק מילים צולבות|משחקים

                                    כל מילה בשורה נפרדת
                                    פורמט: מילה|הגדרה|קטגוריה (ההגדרה והקטגוריה אופציונליות)"
                                        value={wordsText}
                                        onChange={(e) => setWordsText(e.target.value)}
                                        style={{ minHeight: '200px' }}
                                    />
                                    <div className="form-text">
                                        {parseWordsFromText(wordsText).length} מילים נמצאו
                                    </div>
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
                                            רשימה ציבורית (אחרים יוכלו לראות ולהשתמש ברשימה)
                                        </label>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !formData.name.trim() || !wordsText.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                יוצר...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle me-2"></i>
                                                צור רשימה
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/my-wordlists')}
                                    >
                                        ביטול
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    {parseWordsFromText(wordsText).length > 0 && (
                        <div className="card mt-4">
                            <div className="card-header">
                                <h5 className="mb-0">תצוגה מקדימה</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>מילה</th>
                                                <th>הגדרה</th>
                                                <th>קטגוריה</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parseWordsFromText(wordsText).slice(0, 10).map((word, index) => (
                                                <tr key={index}>
                                                    <td className="fw-bold">{word.word}</td>
                                                    <td>{word.definition || '-'}</td>
                                                    <td>
                                                        {word.category && (
                                                            <span className="badge bg-secondary">{word.category}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {parseWordsFromText(wordsText).length > 10 && (
                                        <div className="text-center text-muted">
                                            ועוד {parseWordsFromText(wordsText).length - 10} מילים...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WordListCreator