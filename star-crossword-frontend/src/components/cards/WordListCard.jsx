// components/cards/WordListCard.jsx
import React, { useState } from 'react'
import { useAuth } from '../../providers/AuthContext'
import { likeWordList, unlikeWordList } from '../../services/api'

const WordListCard = ({ wordList, showActions = false, onUpdate, onDelete }) => {
    const { user } = useAuth()
    const [liked, setLiked] = useState(wordList.isLiked)
    const [likesCount, setLikesCount] = useState(wordList.likesCount || 0)
    const [loading, setLoading] = useState(false)

    const handleLike = async (e) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            if (liked) {
                await unlikeWordList(wordList.id)
                setLiked(false)
                setLikesCount(prev => prev - 1)
            } else {
                await likeWordList(wordList.id)
                setLiked(true)
                setLikesCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('Error updating like:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL')
    }

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title text-primary">{wordList.name}</h5>
                    {wordList.isPublic ? (
                        <span className="badge bg-success">ציבורית</span>
                    ) : (
                        <span className="badge bg-secondary">פרטית</span>
                    )}
                </div>

                {wordList.description && (
                    <p className="card-text text-muted small">{wordList.description}</p>
                )}

                <div className="mb-3">
                    <small className="text-muted">
                        <i className="bi bi-person me-1"></i>
                        {wordList.creator?.name || 'משתמש לא ידוע'}
                    </small>
                    <small className="text-muted ms-3">
                        <i className="bi bi-calendar me-1"></i>
                        {formatDate(wordList.createdAt)}
                    </small>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3">
                        <small className="text-muted">
                            <i className="bi bi-list-ul me-1"></i>
                            {wordList.wordsCount || 0} מילים
                        </small>
                        <small className="text-muted">
                            <i className="bi bi-heart me-1"></i>
                            {likesCount}
                        </small>
                    </div>

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

                        {showActions && user?.id === wordList.creatorId && (
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

export default WordListCard