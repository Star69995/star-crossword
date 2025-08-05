// pages/CrosswordSolver.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Crossword from '../components/board/Crossword'
import { getCrosswordById } from '../services/api'

const CrosswordSolver = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [crossword, setCrossword] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchCrossword()
    }, [id])

    const fetchCrossword = async () => {
        try {
            setLoading(true)
            const data = await getCrosswordById(id)
            setCrossword(data)
        } catch (error) {
            setError('שגיאה בטעינת התשבץ')
            console.error('Error fetching crossword:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">טוען תשבץ...</span>
                    </div>
                    <p className="mt-2 text-muted">טוען תשבץ...</p>
                </div>
            </div>
        )
    }

    if (error || !crossword) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">שגיאה</h4>
                        <p>{error || 'תשבץ לא נמצא'}</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            חזור לדף הבית
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="display-5 text-primary">{crossword.title}</h1>
                            {crossword.description && (
                                <p className="text-muted">{crossword.description}</p>
                            )}
                        </div>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/')}
                        >
                            <i className="bi bi-arrow-right me-2"></i>
                            חזור
                        </button>
                    </div>
                </div>
            </div>

            {/* Pass the crossword data to your existing Crossword component */}
            <Crossword crosswordData={crossword} />
        </div>
    )
}

export default CrosswordSolver