import React, { useState } from 'react';
import { useCrossword } from '../../providers/CrosswordContext';
import wordLists from '../../utils/wordLists';
import { isValidDefinitionsArray } from '../../utils/validators';
import NumberInput from './NumberInput';
import WordListSelector from './WordListSelector';
import CustomDefinitionsInput from './CustomDefinitionsInput';

const CrosswordSetup = () => {
    const { gridSize, setSize, gridMaxWords, setMaxWords, setShowSetup, handleNewPuzzle, setDefinitionsList } = useCrossword();
    const [wordList, setWordList] = useState('default');
    const [customDefinitions, setCustomDefinitions] = useState(wordLists[wordList].words);
    const [showCustomDefinitions, setShowCustomDefinitions] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {       
        let parsedDefinitions = customDefinitions;

        // בדיקת קלט רק אם בחרו בהגדרות מותאמות אישית
        if (showCustomDefinitions) {
            const isValid = customDefinitions
                .split('\n')
                .every(line => {
                    const parts = line.split('-');
                    return parts.length === 2 && parts[0].trim() && parts[1].trim();
                });

            if (!isValid) {
                setError('הקלט לא תואם לפורמט הנדרש: "מילה - הגדרה"');
                return; // אם הקלט לא תקין, לא ממשיכים
            } else {
                setError('');
                parsedDefinitions = customDefinitions
                    .split('\n')
                    .map(line => {
                        const [solution, definition] = line.split('-');
                        return { solution: solution.trim(), definition: definition.trim() };
                    });
            }
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
        <div className="modal-backdrop position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" onClick={onClose}>
            <div className="modal-content bg-white p-4 rounded shadow w-100" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header border-bottom pb-3 mb-3">
                    <h5 className="modal-title fw-bold text-center">הגדרת תשבץ</h5>
                </div>

                <div className="modal-body">
                    <NumberInput label="גודל הרשת" id="gridSize" value={gridSize} onChange={setSize} min={5} max={100} />
                    <NumberInput label="מקסימום מילים" id="maxWords" value={gridMaxWords} onChange={setMaxWords} min={1} max={50} />

                    <WordListSelector wordLists={wordLists} selectedList={wordList} onChange={handleWordListChange} />

                    {showCustomDefinitions && (
                        <CustomDefinitionsInput customDefinitions={customDefinitions} onChange={(e) => setCustomDefinitions(e.target.value)} />
                    )}

                    {error && <div className="text-danger mt-2">{error}</div>} {/* הצגת שגיאה אם יש */}
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
