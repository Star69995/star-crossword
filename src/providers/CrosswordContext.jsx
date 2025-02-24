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

        // יצירת עותק מעודכן של ההגדרות
        const updatedDefinitions = { ...definitions };

        updatedGrid[row][col].definitions.forEach((definition) => {
            const { definition: defText } = definition;
            const wordData = wordPositions.find(w => w.definition === defText);


            // נוודא שההגדרה נמצאה לפני שניגשים ל-positions
            if (wordData) {
                const { row, col, isVertical } = wordData;

                // בדיקה האם כל התאים של המילה מולאו נכון
                const isFullyAnswered = [];
                for (let i = 0; i < defText.length; i++) {

                    const checkRow = isVertical ? row + i : row;
                    const checkCol = isVertical ? col : col + i;

                    if (updatedGrid[checkRow]==undefined){
                        continue;
                    }
                    if (updatedGrid[checkRow][checkCol]==undefined){
                        continue;
                    }
                    if (updatedGrid[checkRow][checkCol].solution === null) {
                        continue;
                    }

                    if (updatedGrid[checkRow][checkCol].value !== updatedGrid[checkRow][checkCol].solution) {
                        isFullyAnswered.push(false);
                    }
                }

                // עדכון סטטוס ההגדרה
                const definitionCategory = isVertical ? "down" : "across";
                const definitionEntry = definitions[definitionCategory].find(d => d.text === defText);

                if (definitionEntry) {
                    definitionEntry.isAnswered = isFullyAnswered.length === 0;
                }
            }
        });

        // עדכון ה- state
        setGridData({ grid: updatedGrid, definitions: updatedDefinitions, wordPositions });
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
            // console.log("def", newDefinition);
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
