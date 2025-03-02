import { createContext, useContext, useState } from 'react';
import MakeGrid from './MakeGrid';
import definitions from '../assets/definitions.json';

const CrosswordContext = createContext();

export const useCrossword = () => useContext(CrosswordContext);

export const CrosswordProvider = ({ children }) => {
    const [definitionsList, setDefinitionsList] = useState(definitions.crossword);
    
    const [gridSize, setSize] = useState(15);
    const [gridMaxWords, setMaxWords] = useState(12);
    const [{ grid, definitionsUsed, wordPositions }, setGridData] = useState(() => MakeGrid({ size: gridSize, maxWords: gridMaxWords, definitionsList: definitionsList }));
    const [showSolution, setShowSolution] = useState(false);
    const [selectedDefinition, setSelectedDefinition] = useState(null); // שמירת ההגדרה הפעילה
    

    const handleNewPuzzle = (definitionsToUse = []) => {
        // console.log(definitionsList);
        if (definitionsToUse.length === 0) {
            definitionsToUse = definitionsList;
        }

        
        // console.log(definitionsToUse);
        
        const { grid, definitionsUsed, wordPositions } = MakeGrid({ size: gridSize, maxWords: gridMaxWords, definitionsList: definitionsToUse });
        console.log(definitionsUsed);
        
        setGridData({ grid, definitionsUsed, wordPositions });
        setShowSolution(false);
        setSelectedDefinition(null);
        
    };

    const [showSetup, setShowSetup] = useState(false);
    const handleNewCustomPuzzle = () => {
        setShowSetup(true);
    };

    // const handleSetupSubmit = ({ size, maxWords, wordList }) => {
    //     setSize(size);
    //     setMaxWords(maxWords);
    //     const { grid, definitionsUsed, wordPositions } = MakeGrid({ size, maxWords, wordList });
    //     setGridData({ grid, definitionsUsed, wordPositions });
    //     setShowSetup(false);
    // };

    const handleToggleSolution = () => {
        setShowSolution((prev) => !prev);
    };

    const updateCell = (row, col, value) => {
        const updatedGrid = [...grid];
        updatedGrid[row][col].value = value;

        // יצירת עותק מעודכן של ההגדרות
        const updatedDefinitions = { ...definitionsUsed };

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
                const definitionEntry = definitionsUsed[definitionCategory].find(d => d.text === defText);

                if (definitionEntry) {
                    definitionEntry.isAnswered = isFullyAnswered.length === 0;
                }
            }
        });

        // עדכון ה- state
        setGridData({ grid: updatedGrid, definitionsUsed: updatedDefinitions, wordPositions });
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
        setGridData({ grid: newGrid, definitionsUsed, wordPositions });
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
            grid, definitionsUsed, wordPositions, showSolution,
            handleNewPuzzle, handleNewCustomPuzzle, handleToggleSolution, updateCell,
            selectedDefinition, setActiveDefinition, setSize, setMaxWords, gridSize, gridMaxWords, 
            showSetup,
            setShowSetup,
            definitionsList, setDefinitionsList }}>
            {children}
        </CrosswordContext.Provider>
    );
};
