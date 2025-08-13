import Grid from './Grid';
import DefinitionsArea from './DefinitionsArea';
import { useCrossword } from '../../providers/CrosswordContext.jsx';
import CurrentDef from './CurrentDef.jsx';

const Crossword = () => {
    const { grid, definitions } = useCrossword();

    return (
        <div className="p-6 border rounded-lg shadow-lg">
            <div className="text-center m-3 fs-4 fw-bold">תשבץ</div>

            <CurrentDef />
            <div className="flex justify-center">
                <Grid crossword={grid} />
            </div>
            <CurrentDef />

            <DefinitionsArea definitions={definitions} />

            {/* <div className="mt-4 text-center d-flex justify-content-evenly mb-3">
                <button onClick={handleToggleSolution} className="btn btn-success px-4 py-2 ms-2">
                    {showSolution ? 'הסתר פתרון' : 'הצג פתרון'}
                </button>
            </div> */}

        </div>
    );
};

export default Crossword;