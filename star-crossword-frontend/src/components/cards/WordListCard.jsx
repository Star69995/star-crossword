import { useAuth } from '../../providers/AuthContext'
import { toggleLikeWordList, deleteWordList } from '../../services/api'
import PropTypes from 'prop-types';
import ContentCard from './ContentCard'

const WordListCard = ({ wordList, onDelete }) => {
    const { user } = useAuth()

    const handleLike = async (id) => {
        if (!user) return
        await toggleLikeWordList(id)
    }

    const handleDelete = async (id) => {
            try {
                await deleteWordList(id)
                if (onDelete) onDelete(id)  // <<< Call parent callback
            } catch (error) {
                console.error('Error deleting crossword:', error)
            }
        }

    return (
        <ContentCard
            id={wordList._id}
            title={wordList.title}
            description={wordList.description}
            creator={wordList.creator?.userName}
            createdAt={new Date(wordList.createdAt).toLocaleDateString('he-IL')}
            stats={[
                { icon: "bi-list-ul", label: `${wordList.wordsCount || 0} מילים` }
            ]}
            badge={wordList.isPublic
                ? <span className="badge bg-success">ציבורית</span>
                : <span className="badge bg-secondary">פרטית</span>
            }
            liked={wordList.likes.includes(user?._id)}
            onLike={handleLike} // implement in parent or with hooks!
            likesCount={wordList.likes.length || 0}
            // likeLoading={loading}
            canEdit={user?.id === wordList.creatorId}
            canDelete={user?.id === wordList.creatorId}
            // onEdit={handleEdit}    // implement in parent
            onDelete={handleDelete}
            viewUrl={`/wordlist/${wordList.id}`}
            viewText="צפה"
        />
    )
}
WordListCard.propTypes = {
    wordList: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
};
export default WordListCard