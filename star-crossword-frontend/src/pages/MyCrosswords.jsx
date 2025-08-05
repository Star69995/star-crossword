// pages/MyCrosswords.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CrosswordCard from '../components/cards/CrosswordCard'
import { getMyCrosswords, deleteCrossword } from '../services/api'
import { useAuth } from '../providers/AuthContext'

const MyCrosswords = () => {
    const [crosswords, setCrosswords] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const { user } = useAuth()

    useEffect(() => {
        fetchCrosswords()
    }, [])

    const fetchCrosswords = async () => {
        try {
            setLoading(true)
            const data = await getMyCrosswords()
            setCrosswords(data)
        } catch (error) {
            console.error('Error fetching crosswords:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (crosswordId) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את התשבץ?')) {
            try {
                await deleteCrossword(crosswordId)
                await fetchCrosswords()
            } catch (error) {
                console.error('Error deleting crossword:', error)
            }
        }
    }

    const filteredCrosswords = crosswords.filter(crossword => {
        if (filter === 'public') return crossword.isPublic
        if (filter === 'private') return !crossword.isPublic
        if (filter !== 'all') return crossword.difficulty === filter
        return true
    })

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-4 text-primary">התשבצים שלי</h1>
                        {user?.isContentCreator && (
                            <Link to="/create-crossword" className="btn btn-primary">
                                <i className="bi bi-plus-circle me-2"></i>
                                תשבץ חדש
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="btn-group" role="group">
                        <input type="radio" className="btn-check" name="filter" id="all-crosswords"
                            checked={filter === 'all'} onChange={() => setFilter('all')} />
                        <label className="btn btn-outline-primary" htmlFor="all-crosswords">הכל</label>

                        <input type="radio" className="btn-check" name="filter" id="public-crosswords"
                            checked={filter === 'public'} onChange={() => setFilter('public')} />
                        <label className="btn btn-outline-primary" htmlFor="public-crosswords">ציבוריים</label>

                        <input type="radio" className="btn-check" name="filter" id="private-crosswords"
                            checked={filter === 'private'} onChange={() => setFilter('private')} />
                        <label className="btn btn-outline-primary" htmlFor="private-crosswords">פרטיים</label>

                        <input type="radio" className="btn-check" name="filter" id="easy-crosswords"
                            checked={filter === 'easy'} onChange={() => setFilter('easy')} />
                        <label className="btn btn-outline-primary" htmlFor="easy-crosswords">קל</label>

                        <input type="radio" className="btn-check" name="filter" id="medium-crosswords"
                            checked={filter === 'medium'} onChange={() => setFilter('medium')} />
                        <label className="btn btn-outline-primary" htmlFor="medium-crosswords">בינוני</label>

                        <input type="radio" className="btn-check" name="filter" id="hard-crosswords"
                            checked={filter === 'hard'} onChange={() => setFilter('hard')} />
                        <label className="btn btn-outline-primary" htmlFor="hard-crosswords">קשה</label>
                    </div>
                </div>
                <div className="col-md-4 text-md-end">
                    <div className="text-muted">
                        <i className="bi bi-puzzle me-1"></i>
                        {filteredCrosswords.length} תשבצים
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">טוען...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredCrosswords.map(crossword => (
                        <div key={crossword.id} className="col-lg-4 col-md-6">
                            <CrosswordCard
                                crossword={crossword}
                                showActions={true}
                                onUpdate={fetchCrosswords}
                                onDelete={() => handleDelete(crossword.id)}
                            />
                        </div>
                    ))}
                    {filteredCrosswords.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <div className="text-muted">
                                <i className="bi bi-puzzle fs-1 d-block mb-3"></i>
                                <h4>אין לך עדיין תשבצים</h4>
                                <p>
                                    {user?.isContentCreator
                                        ? 'התחל ליצור את התשבץ הראשון שלך'
                                        : 'רק יוצרי תוכן יכולים ליצור תשבצים'
                                    }
                                </p>
                                {user?.isContentCreator && (
                                    <Link to="/create-crossword" className="btn btn-primary">
                                        <i className="bi bi-plus-circle me-2"></i>
                                        צור תשבץ חדש
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MyCrosswords