import React, { useState } from 'react';
import { useCrossword } from '../providers/CrosswordContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import definitions from '../assets/definitions.json';

const CrosswordSetup = () => {
    const { gridSize, setSize, gridMaxWords, setMaxWords, showSetup, setShowSetup, handleNewPuzzle, definitionsList, setDefinitionsList } = useCrossword();
    const [wordList, setWordList] = useState('ברירת מחדל');
    // console.log(wordList);
    
    const [customDefinitions, setCustomDefinitions] = useState(definitions.crossword);
    const [showCustomDefinitions, setShowCustomDefinitions] = useState(false);
    // console.log(definitions.crossword);


    function isValidDefinitionsArray(data) {
        return (
            Array.isArray(data) && // בודק שהמשתנה הוא מערך
            data.every(
                item =>
                    typeof item === "object" &&
                    item !== null &&
                    "definition" in item &&
                    "solution" in item &&
                    typeof item.definition === "string" &&
                    typeof item.solution === "string"
            )
        );
    }

    const handleSubmit = () => {
        let parsedDefinitions;

        // console.log(customDefinitions);
        // console.log(!isValidDefinitionsArray(customDefinitions));
        
        
        // check if the deflist is valid, else prase
        if (!isValidDefinitionsArray (customDefinitions)  )
        { parsedDefinitions = customDefinitions
            .split('\n')
            .map(line => {
                const [solution, definition] = line.split('-');
                return solution && definition ? { solution: solution.trim(), definition: definition.trim() } : null;
            })
            .filter(entry => entry !== null);}

        else { parsedDefinitions = customDefinitions;}

        // console.log(parsedDefinitions);
        setDefinitionsList(parsedDefinitions);
        // console.log(definitionsList);
        

        handleNewPuzzle(parsedDefinitions);
        onClose();
    };

    const onClose = () => setShowSetup(false);

    return (
        <div className="modal-backdrop position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" dir="rtl">
            <div className="modal-content bg-white p-4 rounded shadow w-100" style={{ maxWidth: '450px' }}>
                <div className="modal-header border-bottom pb-3 mb-3">
                    <h5 className="modal-title fw-bold text-center">הגדרת תשבץ</h5>
                </div>

                <div className="modal-body">
                    <div className="mb-3 row justify-content-center">
                        <label htmlFor="gridSize" className="col-sm-4 col-form-label">גודל הרשת:</label>
                        <div className="col-sm-3">
                            <input
                                type="number"
                                id="gridSize"
                                className="form-control"
                                value={gridSize}
                                onChange={(e) => setSize(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row justify-content-center">
                        <label htmlFor="maxWords" className="col-sm-4 col-form-label">מקסימום מילים:</label>
                        <div className="col-sm-3">
                            <input
                                type="number"
                                id="maxWords"
                                className="form-control"
                                value={gridMaxWords}
                                onChange={(e) => setMaxWords(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="wordList" className="form-label">רשימת מילים:</label>
                        <select
                            id="wordList"
                            className="form-select"
                            value={wordList}
                            // onChange={(e) => setWordList(e.target.value)}
                            onChange={(e) => {
                                let selectedValue = e.target.value;
                                setWordList(selectedValue);
                                // console.log(selectedValue);
                                

                                // שינוי כלשהו בהתאם לבחירה
                                if (selectedValue === "מותאם אישית") {
                                    // בצע פעולה כלשהי במקרה שהאפשרות "מותאם אישית" נבחרה
                                    // console.log("בחרת מותאם אישית");
                                    // לדוגמה, אפשר להפעיל שדה נוסף
                                    setShowCustomDefinitions(true); // מניח ששדה customDefinitions מוצג כאשר נבחרת אפשרות זו
                                    setCustomDefinitions("");
                                } else {
                                    setShowCustomDefinitions(false);
                                    if (selectedValue === "ברירת מחדל") {
                                        // console.log(definitions.crossword);
                                        
                                        setCustomDefinitions(definitions.crossword);
                                    }
                                    
                                    // setWordList(e.target.value)
                                }
                            }}
                        >
                            <option value="ברירת מחדל">ברירת מחדל</option>
                            <option value="מותאם אישית">מותאם אישית</option>
                            {/* <option value="אחר"> אחר</option> */}
                            
                        </select>
                    </div>

                    {showCustomDefinitions && <div className="mb-3">
                        <label htmlFor="customDefinitions" className="form-label">הגדרות מותאמות אישית (פורמט: תשובה - הגדרה):</label>
                        <textarea
                            id="customDefinitions"
                            className="form-control"
                            rows="5"
                            value={customDefinitions}
                            onChange={(e) => setCustomDefinitions(e.target.value)}
                            placeholder="מילה - הגדרה&#10;מילה - הגדרה"
                            style={{
                                resize: 'vertical',
                                maxHeight: '40vh', // הגבלת הגובה ל-40% מגובה המסך
                                minHeight: '100px', // הגדרת גובה מינימלי
                            }}
                        ></textarea>
                    </div>}

                </div>

                <div className="modal-footer d-flex justify-content-between border-top pt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >
                        אישור
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CrosswordSetup;