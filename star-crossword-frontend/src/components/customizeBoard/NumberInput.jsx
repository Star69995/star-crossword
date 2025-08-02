import React from 'react';

const NumberInput = ({ label, id, value, onChange, min, max }) => {
    const handleChange = (e) => {
        const newValue = Number(e.target.value);
        if (newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    return (
        <div className="mb-3 row justify-content-center">
            <label htmlFor={id} className="col-sm-4 col-form-label">{label}:</label>
            <div className="col-sm-3">
                <input
                    type="number"
                    id={id}
                    className="form-control"
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                />
            </div>
        </div>
    );
};

export default NumberInput;
