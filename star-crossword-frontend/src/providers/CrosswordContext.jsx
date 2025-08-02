import { createContext, useContext, useState, useEffect } from 'react';
import MakeGrid from '../utils/MakeGrid';
import wordLists from '../utils/wordLists';

const CrosswordContext = createContext();

export const useCrossword = () => useContext(CrosswordContext);

export const CrosswordProvider = ({ children }) => {
    // const [definitionsList, setDefinitionsList] = useState(wordLists.default.words);
    
    // const [gridSize, setSize] = useState(15);
    // const [gridMaxWords, setMaxWords] = useState(12);
    // const [{ grid, definitionsUsed, wordPositions }, setGridData] = useState(() => MakeGrid({ size: gridSize, maxWords: gridMaxWords, definitionsList: definitionsList }));
    // const [showSolution, setShowSolution] = useState(false);
    // const [selectedDefinition, setSelectedDefinition] = useState(null); // שמירת ההגדרה הפעילה

    // const [showSetup, setShowSetup] = useState(false);
    
    // // Load saved state from local storage
    // useEffect(() => {
    //     const savedState = JSON.parse(localStorage.getItem('crosswordState'));
    //     if (savedState) {
    //         // console.log('savedState:', savedState);
    //         setGridData(savedState.gridData);
    //         setDefinitionsList(savedState.definitionsList);
    //         setSize(savedState.gridSize);
    //         setMaxWords(savedState.gridMaxWords);
    //     }
    // }, []);

    const [definitionsList, setDefinitionsList] = useState(() => {
        const savedState = JSON.parse(localStorage.getItem('crosswordState'));
        return savedState ? savedState.definitionsList : wordLists.default.words;
    });

    const [gridSize, setSize] = useState(() => {
        const savedState = JSON.parse(localStorage.getItem('crosswordState'));
        return savedState ? savedState.gridSize : 15;
    });

    const [gridMaxWords, setMaxWords] = useState(() => {
        const savedState = JSON.parse(localStorage.getItem('crosswordState'));
        return savedState ? savedState.gridMaxWords : 12;
    });

    const [{ grid, definitionsUsed, wordPositions }, setGridData] = useState(() => {
        const savedState = JSON.parse(localStorage.getItem('crosswordState'));
        if (savedState) {
            return savedState.gridData;
        } else {
            return MakeGrid({
                size: gridSize,
                maxWords: gridMaxWords,
                definitionsList: definitionsList,
            });
        }
    });

    const [showSolution, setShowSolution] = useState(false);
    const [selectedDefinition, setSelectedDefinition] = useState(null); // Active definition
    const [showSetup, setShowSetup] = useState(false);

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem('crosswordState'));
        if (savedState) {
            setGridData(savedState.gridData);
            setDefinitionsList(savedState.definitionsList);
            setSize(savedState.gridSize);
            setMaxWords(savedState.gridMaxWords);
            if (savedState.selectedDefinition) {
                setActiveDefinition(null, savedState.selectedDefinition.definition); // הוספתי את שמירת ההגדרה המסמנת
            }
        }
    }, []);



    // Save state to local storage whenever grid or other important state changes
    useEffect(() => {
        const stateToSave = {
            gridData: { grid, definitionsUsed, wordPositions },
            definitionsList,
            gridSize,
            gridMaxWords,
            selectedDefinition, // הוספתי את ההגדרה המסמנת לשמירה
        };
        localStorage.setItem('crosswordState', JSON.stringify(stateToSave));
    }, [grid, definitionsUsed, wordPositions, definitionsList, gridSize, gridMaxWords, selectedDefinition]); // הוספתי את selectedDefinition למעקב


    const handleNewPuzzle = (definitionsToUse = []) => {
        if (definitionsToUse.length === 0) {
            definitionsToUse = definitionsList;
        }

        const { grid, definitionsUsed, wordPositions } = MakeGrid({ size: gridSize, maxWords: gridMaxWords, definitionsList: definitionsToUse });

        setGridData({ grid, definitionsUsed, wordPositions });
        setShowSolution(false);
        setSelectedDefinition(null);

    };

    const handleNewCustomPuzzle = () => {
        setShowSetup(true);
    };

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
        // console.log(inputDefinition);
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
            console.log(inputDefinition);
            
            const newDefinition = { definition: inputDefinition, isVertical: getDefinitionDirection(inputDefinition) };
            console.log(newDefinition);
            
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
