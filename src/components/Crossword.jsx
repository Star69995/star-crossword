import React, { useState } from 'react';
import Grid from './grid';
import MakeGrid from '../providers/MakeGrid.js';
import DefinitionsArea from './DefinitionsArea';
import { useCrossword, CrosswordProvider } from '../providers/CrosswordContext.jsx';

const Crossword = () => {
    const { grid, definitions, showSolution, handleNewPuzzle, handleToggleSolution } = useCrossword();

    return (
        <div className="p-6 border rounded-lg shadow-lg">
            <div className="text-center mb-4 text-xl font-bold">תשבץ</div>
            <div className="flex justify-center">
                <Grid crossword={grid} />
            </div>

            <DefinitionsArea definitions={definitions} />

            <div className="mt-4 text-center">
                <button
                    onClick={handleNewPuzzle}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    תשבץ חדש
                </button>

                <button
                    onClick={handleToggleSolution}
                    className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    {showSolution ? 'הסתר פתרון' : 'הצג פתרון'}
                </button>
            </div>
        </div>
    );
};

export default Crossword;