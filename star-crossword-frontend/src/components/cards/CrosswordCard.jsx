import { useAuth } from '../../providers/AuthContext'
import { toggleLikeCrossword, deleteCrossword } from '../../services/api'
import PropTypes from 'prop-types';
import ContentCard from './ContentCard';
import { useNavigate } from 'react-router-dom';

const CrosswordCard = ({ crossword, onDelete }) => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleLike = async (id) => {
        // TODO: if user is not logged in, redirect to login
        if (!user) return
        await toggleLikeCrossword(id)

    }

    const handleDelete = async (id) => {
        try {
            await deleteCrossword(id)
            if (onDelete) onDelete(id)  // <<< Call parent callback
        } catch (error) {
            console.error('Error deleting crossword:', error)
        }
    }

    const handleEdit = () => {
        navigate(`/edit-crossword/${crossword._id}/`)
    }

    return (
        <ContentCard
        id={crossword._id}
            title={crossword.title}
            description={crossword.description}
            creator={crossword.creator?.userName}
            createdAt={new Date(crossword.createdAt).toLocaleDateString('he-IL')}
            stats={[
                { icon: "bi-grid", label: `${crossword.crosswordObject?.gridData?.grid?.length || "?"}x${crossword.crosswordObject?.gridData?.grid?.[0]?.length || "?"}` }
                // more stats if needed
            ]}
            badge={crossword.isPublic}
            liked={crossword.likes.includes(user?._id)}
            onLike={handleLike}
            likesCount={crossword.likes.length || 0}
            // likeLoading={loading}
            canEdit={user?._id === crossword.creator._id}
            canDelete={user?._id === crossword.creator._id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            viewUrl={`/crossword/${crossword._id}`}
            viewText="פתור תשבץ"
        />
    )
}

export default CrosswordCard
CrosswordCard.propTypes = {
    crossword: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
};