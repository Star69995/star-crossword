import { createContext, useContext, useState, useEffect } from 'react';
import MakeGrid from '../utils/MakeGrid';
import wordLists from '../utils/wordLists';
import PropTypes from 'prop-types';

const CrosswordContext = createContext();

export const useCrossword = () => useContext(CrosswordContext);

export const CrosswordProvider = ({ children }) => {
    // Safe function to load saved state
    const loadSavedState = () => {
        try {
            const savedState = localStorage.getItem('crosswordState');
            if (!savedState || savedState === 'undefined' || savedState === 'null') {
                return null;
            }
            return JSON.parse(savedState);
        } catch (error) {
            console.error('Error loading saved state, clearing localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem('crosswordState');
            return null;
        }
    };

    // Safe function to get default word list
    const getDefaultWordList = () => {
        try {
            return wordLists?.default?.words || [];
        } catch (error) {
            console.error('Error loading default word list:', error);
            return [];
        }
    };

    // Safe function to create initial grid
    const createInitialGrid = (size, maxWords, definitionsList) => {
        try {
            return MakeGrid({
                size,
                maxWords,
                definitionsList,
            });
        } catch (error) {
            console.error('Error creating initial grid:', error);
            return {
                grid: Array(size).fill().map(() =>
                    Array(size).fill().map(() => ({
                        value: '',
                        solution: null,
                        definitions: [],
                        isHighlighted: false
                    }))
                ),
                definitionsUsed: { across: [], down: [] },
                wordPositions: []
            };
        }
    };

    const savedState = loadSavedState();

    // State initialization with better error handling
    const [definitionsList, setDefinitionsList] = useState(() => {
        return savedState?.definitionsList || getDefaultWordList();
    });

    const [gridSize, setSize] = useState(() => {
        return savedState?.gridSize || 15;
    });

    const [gridMaxWords, setMaxWords] = useState(() => {
        return savedState?.gridMaxWords || 12;
    });

    const [{ grid, definitionsUsed, wordPositions }, setGridData] = useState(() => {
        if (savedState?.gridData) {
            return savedState.gridData;
        } else {
            const size = savedState?.gridSize || 15;
            const maxWords = savedState?.gridMaxWords || 12;
            const definitions = savedState?.definitionsList || getDefaultWordList();

            return createInitialGrid(size, maxWords, definitions);
        }
    });

    const [showSolution, setShowSolution] = useState(false);
    const [selectedDefinition, setSelectedDefinition] = useState(null);
    const [showSetup, setShowSetup] = useState(false);

    // Save state to localStorage with error handling
    useEffect(() => {
        try {
            const stateToSave = {
                gridData: { grid, definitionsUsed, wordPositions },
                definitionsList,
                gridSize,
                gridMaxWords,
                selectedDefinition,
            };
            localStorage.setItem('crosswordState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving state to localStorage:', error);
        }
    }, [grid, definitionsUsed, wordPositions, definitionsList, gridSize, gridMaxWords, selectedDefinition]);

    const handleNewPuzzle = (definitionsToUse = []) => {
        try {
            if (definitionsToUse.length === 0) {
                definitionsToUse = definitionsList;
            }

            const newGridData = MakeGrid({
                size: gridSize,
                maxWords: gridMaxWords,
                definitionsList: definitionsToUse
            });

            setGridData(newGridData);
            setShowSolution(false);
            setSelectedDefinition(null);
        } catch (error) {
            console.error('Error creating new puzzle:', error);
        }
    };

    const handleNewCustomPuzzle = () => {
        setShowSetup(true);
    };

    const handleToggleSolution = () => {
        setShowSolution((prev) => !prev);
    };

    const updateCell = (row, col, value) => {
        try {
            if (!grid[row] || !grid[row][col]) {
                console.error('Invalid cell position:', row, col);
                return;
            }

            const updatedGrid = [...grid];
            updatedGrid[row][col] = { ...updatedGrid[row][col], value };

            const updatedDefinitions = { ...definitionsUsed };

            updatedGrid[row][col].definitions?.forEach((definition) => {
                const { definition: defText } = definition;
                const wordData = wordPositions.find(w => w.definition === defText);

                if (wordData) {
                    const { row: startRow, col: startCol, isVertical } = wordData;
                    let isFullyAnswered = true;

                    for (let i = 0; i < defText.length; i++) {
                        const checkRow = isVertical ? startRow + i : startRow;
                        const checkCol = isVertical ? startCol : startCol + i;

                        if (!updatedGrid[checkRow] || !updatedGrid[checkRow][checkCol]) {
                            continue;
                        }

                        const cell = updatedGrid[checkRow][checkCol];
                        if (!cell.solution || cell.value !== cell.solution) {
                            isFullyAnswered = false;
                            break;
                        }
                    }

                    const definitionCategory = isVertical ? "down" : "across";
                    const definitionEntry = updatedDefinitions[definitionCategory]?.find(d => d.text === defText);

                    if (definitionEntry) {
                        definitionEntry.isAnswered = isFullyAnswered;
                    }
                }
            });

            setGridData({ grid: updatedGrid, definitionsUsed: updatedDefinitions, wordPositions });
        } catch (error) {
            console.error('Error updating cell:', error);
        }
    };

    const updateHighlightedCells = (definition) => {
        try {
            const newGrid = grid.map(row =>
                row.map(cell => {
                    const isHighlighted = cell.definitions?.some(def =>
                        def.definition === definition.definition && def.isVertical === definition.isVertical
                    );
                    return { ...cell, isHighlighted };
                })
            );
            setGridData({ grid: newGrid, definitionsUsed, wordPositions });
        } catch (error) {
            console.error('Error updating highlighted cells:', error);
        }
    };

    const getDefinitionDirection = (definition) => {
        const word = wordPositions.find(word => word.definition === definition);
        return word ? word.isVertical : null;
    };

    const setActiveDefinition = (cell = null, inputDefinition = null) => {
        try {
            if (cell && cell.definitions?.length > 0) {
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
            } else if (inputDefinition) {
                const newDefinition = {
                    definition: inputDefinition,
                    isVertical: getDefinitionDirection(inputDefinition)
                };
                setSelectedDefinition(newDefinition);
                updateHighlightedCells(newDefinition);
            }
        } catch (error) {
            console.error('Error setting active definition:', error);
        }
    };

    return (
        <CrosswordContext.Provider value={{
            grid,
            definitionsUsed,
            wordPositions,
            showSolution,
            handleNewPuzzle,
            handleNewCustomPuzzle,
            handleToggleSolution,
            updateCell,
            selectedDefinition,
            setActiveDefinition,
            setSize,
            setMaxWords,
            gridSize,
            gridMaxWords,
            showSetup,
            setShowSetup,
            definitionsList,
            setDefinitionsList
        }}>
            {children}
        </CrosswordContext.Provider>
    );
};

CrosswordProvider.propTypes = {
    children: PropTypes.node.isRequired,
};