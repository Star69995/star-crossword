// components/cards/CrosswordCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/AuthContext'
import { likeCrossword, unlikeCrossword } from '../../services/api'

const CrosswordCard = ({ crossword, showActions = false, onUpdate, onDelete }) => {
    const { user } = useAuth()
    const [liked, setLiked] = useState(crossword.isLiked)
    const [likesCount, setLikesCount] = useState(crossword.likesCount || 0)
    const [loading, setLoading] = useState(false)

    const handleLike = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) return

        setLoading(true)
        try {
            if (liked) {
                await unlikeCrossword(crossword.id)
                setLiked(false)
                setLikesCount(prev => prev - 1)
            } else {
                await likeCrossword(crossword.id)
                setLiked(true)
                setLikesCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('Error updating like:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'success'
            case 'medium': return 'warning'
            case 'hard': return 'danger'
            default: return 'secondary'
        }
    }

    const getDifficultyText = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'קל'
            case 'medium': return 'בינוני'
            case 'hard': return 'קשה'
            default: return 'לא ידוע'
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL')
    }

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title text-primary">{crossword.title}</h5>
                    <span className={`badge bg-${getDifficultyColor(crossword.difficulty)}`}>
                        {getDifficultyText(crossword.difficulty)}
                    </span>
                </div>

                {crossword.description && (
                    <p className="card-text text-muted small">{crossword.description}</p>
                )}

                <div className="mb-3">
                    <small className="text-muted">
                        <i className="bi bi-person me-1"></i>
                        {crossword.creator?.name || 'משתמש לא ידוע'}
                    </small>
                    <small className="text-muted ms-3">
                        <i className="bi bi-calendar me-1"></i>
                        {formatDate(crossword.createdAt)}
                    </small>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-3">
                        <small className="text-muted">
                            <i className="bi bi-grid me-1"></i>
                            {crossword.size}x{crossword.size}
                        </small>
                        <small className="text-muted">
                            <i className="bi bi-list-ol me-1"></i>
                            {crossword.wordsCount || 0} מילים
                        </small>
                        <small className="text-muted">
                            <i className="bi bi-heart me-1"></i>
                            {likesCount}
                        </small>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/crossword/${crossword.id}`} className="btn btn-primary btn-sm">
                        <i className="bi bi-play-circle me-1"></i>
                        פתור תשבץ
                    </Link>

                    <div className="btn-group btn-group-sm">
                        {user && (
                            <button
                                className={`btn ${liked ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={handleLike}
                                disabled={loading}
                                title={liked ? 'בטל לייק' : 'לייק'}
                            >
                                <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                            </button>
                        )}

                        {showActions && user?.id === crossword.creatorId && (
                            <>
                                <button className="btn btn-outline-primary" title="ערוך">
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={onDelete}
                                    title="מחק"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CrosswordCard