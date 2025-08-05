// pages/Home.jsx
import { useState, useEffect } from 'react'
import CrosswordCard from '../components/cards/CrosswordCard'
import { getCrosswords } from '../services/api'

const Home = () => {
    const [crosswords, setCrosswords] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetchCrosswords()
    }, [filter])

    const fetchCrosswords = async () => {
        try {
            setLoading(true)
            const data = await getCrosswords({
                isPublic: true,
                difficulty: filter === 'all' ? undefined : filter
            })
            setCrosswords(data)
        } catch (error) {
            console.error('Error fetching crosswords:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-4 text-primary">תשבצים פומביים</h1>
                        <div className="btn-group" role="group">
                            <input type="radio" className="btn-check" name="filter" id="all"
                                checked={filter === 'all'} onChange={() => setFilter('all')} />
                            <label className="btn btn-outline-primary" htmlFor="all">הכל</label>

                            <input type="radio" className="btn-check" name="filter" id="easy"
                                checked={filter === 'easy'} onChange={() => setFilter('easy')} />
                            <label className="btn btn-outline-primary" htmlFor="easy">קל</label>

                            <input type="radio" className="btn-check" name="filter" id="medium"
                                checked={filter === 'medium'} onChange={() => setFilter('medium')} />
                            <label className="btn btn-outline-primary" htmlFor="medium">בינוני</label>

                            <input type="radio" className="btn-check" name="filter" id="hard"
                                checked={filter === 'hard'} onChange={() => setFilter('hard')} />
                            <label className="btn btn-outline-primary" htmlFor="hard">קשה</label>
                        </div>
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
                    {crosswords.map(crossword => (
                        <div key={crossword.id} className="col-lg-4 col-md-6">
                            <CrosswordCard crossword={crossword} />
                        </div>
                    ))}
                    {crosswords.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <div className="text-muted">
                                <i className="bi bi-puzzle fs-1 d-block mb-3"></i>
                                <h4>לא נמצאו תשבצים</h4>
                                <p>נסה לשנות את הפילטר או חזור מאוחר יותר</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Home