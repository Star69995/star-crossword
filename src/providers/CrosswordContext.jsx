import { createContext, useContext, useState } from 'react';
import MakeGrid from './MakeGrid';

const CrosswordContext = createContext();

export const useCrossword = () => useContext(CrosswordContext);

export const CrosswordProvider = ({ children }) => {
    const [{ grid, definitions, wordPositions }, setGridData] = useState(() => MakeGrid({ size: 12, maxWords: 8 }));
    const [showSolution, setShowSolution] = useState(false);
    const [selectedDefinition, setSelectedDefinition] = useState(null); // שמירת ההגדרה הפעילה

    const handleNewPuzzle = () => {
        const { grid, definitions, wordPositions } = MakeGrid({ size: 12, maxWords: 8 });
        setGridData({ grid, definitions, wordPositions });
        setShowSolution(false);
        setSelectedDefinition(null);
    };

    const handleToggleSolution = () => {
        setShowSolution((prev) => !prev);
    };

    const updateCell = (row, col, value) => {
        const updatedGrid = [...grid];
        updatedGrid[row][col].value = value;
        setGridData({ grid: updatedGrid, definitions, wordPositions });
    };



    const updateHighlightedCells = (definition) => {
        const newGrid = grid.map(row =>
            row.map(cell => {
                const isHighlighted = cell.definitions.some(def =>
                    def.definition === definition.definition && def.isVertical === definition.isVertical
                );
                return { ...cell, isHighlighted };
            })
        );
        setGridData({ grid: newGrid, definitions, wordPositions });
    };


    const getDefinitionDirection = (definition) => {
        const word = wordPositions.find(word => word.definition === definition);
        return word ? word.isVertical : null;
    };

    const setActiveDefinition = (cell=null, inputDefinition=null) => {
        if (cell) {
            if (cell.definitions.length === 1) {
                setSelectedDefinition(cell.definitions[0]);
                updateHighlightedCells(cell.definitions[0]);
            } else {
                const newDefinition =
                    selectedDefinition == null || selectedDefinition.isVertical !== cell.definitions[0].isVertical
                        ? cell.definitions[0]
                        : cell.definitions[1];
                setSelectedDefinition(newDefinition);
                updateHighlightedCells(newDefinition);
            }
        }
        else if (inputDefinition) {
            const newDefinition = { definition: inputDefinition, isVertical: getDefinitionDirection(inputDefinition) };
            console.log("def", newDefinition);
            setSelectedDefinition(newDefinition);
            updateHighlightedCells(newDefinition);
        }
    };


    return (
        <CrosswordContext.Provider value={{
            grid, definitions, wordPositions, showSolution,
            handleNewPuzzle, handleToggleSolution, updateCell,
            selectedDefinition, setActiveDefinition }}>
            {children}
        </CrosswordContext.Provider>
    );
};
