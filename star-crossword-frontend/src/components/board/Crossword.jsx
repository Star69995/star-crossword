// import React, { useState } from 'react';
import Grid from './Grid';
// import MakeGrid from '../providers/MakeGrid.js';
import DefinitionsArea from './DefinitionsArea';
import { useCrossword } from '../../providers/CrosswordContext.jsx';
import CurrentDef from './CurrentDef.jsx';
// import MakeGrid from '../../providers/MakeGrid.js';

const Crossword = () => {
    const { grid, definitions, showSolution, handleNewPuzzle, handleNewCustomPuzzle, handleToggleSolution } = useCrossword();

    return (
        <div className="p-6 border rounded-lg shadow-lg">
            <div className="text-center m-3 fs-4 fw-bold">תשבץ</div>

            <CurrentDef />
            <div className="flex justify-center">
                <Grid crossword={grid} />
            </div>
            <CurrentDef />

            <DefinitionsArea definitions={definitions} />

            <div className="mt-4 text-center d-flex justify-content-evenly mb-3">
                <button onClick={() => handleNewPuzzle()} className="btn btn-primary px-4 py-2">
                    תשבץ אקראי חדש
                </button>

                <button onClick={handleNewCustomPuzzle} className="btn btn-primary px-4 py-2 text-wrap" style={{ maxWidth: '30%' }}>
                    תשבץ מותאם אישית חדש
                </button>

                <button onClick={handleToggleSolution} className="btn btn-success px-4 py-2 ms-2">
                    {showSolution ? 'הסתר פתרון' : 'הצג פתרון'}
                </button>
            </div>

        </div>
    );
};

export default Crossword;