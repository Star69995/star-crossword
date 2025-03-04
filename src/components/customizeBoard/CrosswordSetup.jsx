import React, { useState } from 'react';
import { useCrossword } from '../../providers/CrosswordContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import wordLists from './../../assets/wordLists.json';
import { isValidDefinitionsArray } from '../../utils/validators';

const CrosswordSetup = () => {
    const { gridSize, setSize, gridMaxWords, setMaxWords, setShowSetup, handleNewPuzzle, setDefinitionsList } = useCrossword();
    const [wordList, setWordList] = useState('default');
    const [customDefinitions, setCustomDefinitions] = useState(wordLists[wordList].words);
    const [showCustomDefinitions, setShowCustomDefinitions] = useState(false);

    const handleSubmit = () => {
        let parsedDefinitions = customDefinitions;

        if (!isValidDefinitionsArray(customDefinitions)) {
            parsedDefinitions = customDefinitions
                .split('\n')
                .map(line => {
                    const [solution, definition] = line.split('-');
                    return solution && definition ? { solution: solution.trim(), definition: definition.trim() } : null;
                })
                .filter(entry => entry !== null);
        }

        setDefinitionsList(parsedDefinitions);
        handleNewPuzzle(parsedDefinitions);
        onClose();
    };

    const onClose = () => setShowSetup(false);

    const handleWordListChange = (e) => {
        const selectedValue = e.target.value;
        setWordList(selectedValue);

        if (selectedValue === "custom") {
            setShowCustomDefinitions(true);
            setCustomDefinitions("");
        } else {
            setShowCustomDefinitions(false);
            setCustomDefinitions(wordLists[selectedValue].words);
        }
    };

    return (
        <div className="modal-backdrop position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            onClick={onClose}>
            <div className="modal-content bg-white p-4 rounded shadow w-100" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header border-bottom pb-3 mb-3">
                    <h5 className="modal-title fw-bold text-center">הגדרת תשבץ</h5>
                </div>

                <div className="modal-body">
                    <div className="mb-3 row justify-content-center">
                        <label htmlFor="gridSize" className="col-sm-4 col-form-label">גודל הרשת:</label>
                        <div className="col-sm-3">
                            <input type="number" id="gridSize" className="form-control" value={gridSize} onChange={(e) => setSize(Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="mb-3 row justify-content-center">
                        <label htmlFor="maxWords" className="col-sm-4 col-form-label">מקסימום מילים:</label>
                        <div className="col-sm-3">
                            <input type="number" id="maxWords" className="form-control" value={gridMaxWords} onChange={(e) => setMaxWords(Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="wordList" className="form-label">רשימת מילים:</label>
                        <select id="wordList" className="form-select" value={wordList} onChange={handleWordListChange}>
                            {Object.entries(wordLists).map(([key, list]) => (
                                <option key={key} value={key}>{list.name}</option>
                            ))}
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
                            style={{ resize: 'vertical', maxHeight: '40vh', minHeight: '100px' }}
                        ></textarea>
                    </div>}

                </div>

                <div className="modal-footer d-flex justify-content-between border-top pt-3">
                    <button className="btn btn-primary" onClick={handleSubmit}>אישור</button>
                    <button className="btn btn-secondary" onClick={onClose}>ביטול</button>
                </div>
            </div>
        </div>
    );
};

export default CrosswordSetup;
