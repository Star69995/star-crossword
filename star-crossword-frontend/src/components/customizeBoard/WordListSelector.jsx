import React from 'react';

const WordListSelector = ({ wordLists, selectedList, onChange }) => {
    return (
        <div className="mb-3">
            <label htmlFor="wordList" className="form-label">רשימת מילים:</label>
            <select
                id="wordList"
                className="form-select"
                value={selectedList}
                onChange={onChange}
            >
                {Object.entries(wordLists).map(([key, list]) => (
                    <option key={key} value={key}>
                        {list.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default WordListSelector;
