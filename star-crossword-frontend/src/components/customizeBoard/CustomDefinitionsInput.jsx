import React from 'react';

const CustomDefinitionsInput = ({ customDefinitions, onChange }) => {
    return (
        <div className="mb-3">
            <label htmlFor="customDefinitions" className="form-label">
                הגדרות מותאמות אישית (פורמט: תשובה - הגדרה):
            </label>
            <textarea
                id="customDefinitions"
                className="form-control"
                rows="5"
                value={customDefinitions}
                onChange={onChange}
                placeholder="מילה - הגדרה&#10;מילה - הגדרה"
                style={{ resize: 'vertical', maxHeight: '40vh', minHeight: '100px' }}
            ></textarea>
        </div>
    );
};

export default CustomDefinitionsInput;
