import React, { useEffect, useRef, useState } from 'react';
import { useCrossword } from '../providers/CrosswordContext';

const Block = ({ row, col }) => {
    const { grid, showSolution, updateCell, selectedDefinition, setActiveDefinition } = useCrossword();
    const cell = grid[row][col];
    const value = showSolution && cell.solution ? cell.solution : cell.value || '';

    const inputRef = useRef(null);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '' || /^[א-ת]$/.test(inputValue)) {
            updateCell(row, col, inputValue);
            if (inputValue === cell.solution) {
                e.target.disabled = true;
                e.target.style.backgroundColor = 'rgb(221, 255, 221)';
            }
            // מציאת האות הבאה באותה הגדרה
            moveToNextCell(row, col, cell.isVertical);
        }
    };

    // פונקציה שמעבירה את הפוקוס לאות הבאה
    const moveToNextCell = (row, col, isVertical) => {
        console.log(row, col, isVertical);
        let nextRow = row;
        let nextCol = col;

        if (isVertical) {
            nextRow++;
        } else {
            nextCol++;
        }

        // אם הגעת לסוף ההגדרה, עבר להנחה הבאה
        if (nextRow >= 0 && nextRow < grid.length && nextCol >= 0 && nextCol < grid[0].length) {
            console.log(nextRow, nextCol);
            const nextCell = document.querySelector(`[data-row="${nextRow}"][data-col="${nextCol}"]`);
            console.log(nextCell);
            if (nextCell) {
                nextCell.focus();
            }
        }
    };
    const handleClick = () => {
        if (cell.definition !== null) {
            setActiveDefinition(cell, null);
        }
    };
    const isBlack = cell.solution === null;
    // let isSelected = cell.definitions.some(def => def === selectedDefinition) && selectedDefinition !== null;

    // // משתנה שיעדכן אם התא הנוכחי שייך להגדרה הפעילה
    // const [isSelected, setIsSelected] = useState(false);
    // // מעדכן אם התא הנוכחי שייך להגדרה הפעילה
    // useEffect(() => {
    //     const isSelected1 = cell.definitions.some(def => def === selectedDefinition) && selectedDefinition !== null;
    //     setIsSelected(isSelected1);
    //     if (isSelected1) {
    //         console.log("1");}
    //     // change backgroundColor here
    // }, [selectedDefinition]);  // מעדכן את isSelected כאשר selectedDefinition או  משתנים

    const isSelected = selectedDefinition && cell.definitions.includes(selectedDefinition);

    // console.log(cell);
    const [focusedCell, setFocusedCell] = useState(null);
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {cell.definitionNumber && !isBlack && (
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    fontSize: '12px',
                    zIndex: 1
                }}>
                    {cell.definitionNumber}
                </div>
            )}
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                maxLength="1"
                style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    fontSize: '24px',
                    border: 'none',
                    backgroundColor: isBlack ? 'black' :
                        focusedCell?.row === row && focusedCell?.col === col ? 'rgb(171, 178, 255)' :
                            cell.isHighlighted ? 'rgb(200, 220, 255)' :
                                showSolution && cell.solution ? 'rgb(221, 255, 221)' :
                                    'white',

                    boxSizing: 'border-box',
                    outline: 'none',
                }}
                disabled={isBlack || (showSolution && cell.solution)}
                onFocus={(e) => {
                    if (!showSolution) {
                        // e.target.style.backgroundColor = 'rgb(230, 232, 253)';
                        e.target.select();

                        setFocusedCell({ row, col });
                    }
                }}
                onBlur={(e) => {
                    if (!showSolution && value !== cell.solution && !cell.isHighlighted ) {
                        e.target.style.backgroundColor = 'white';
                    }
                    setFocusedCell(null);
                }}
                data-row={row}
                data-col={col}
                ref={inputRef}
            />
        </div>
    );
};

export default Block;