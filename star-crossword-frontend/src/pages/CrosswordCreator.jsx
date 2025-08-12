import CrosswordForm from '../components/forms/crosswords/CrosswordForm'
import { createCrossword } from '../services/api'
import { useNavigate } from 'react-router-dom'

const CrosswordCreator = () => {
    const navigate = useNavigate(); 

    const handleCreateCrossword = async (data) => {
        try {
            await createCrossword(data);
            navigate("/my-crosswords");
        } catch (error) {
            console.log('error: ', error);
        } 
    }

    return (
        <CrosswordForm onSubmit={handleCreateCrossword} />
    )
}

export default CrosswordCreator