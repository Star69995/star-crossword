import { useCrossword } from '../providers/CrosswordContext';
import React, { useState } from 'react';

function Definition({ definition }) {
    const { selectedDefinition, setActiveDefinition } = useCrossword();

    const cleanedDefinition = definition.replace(/^\d+\.\s/, '');


    const isActive = selectedDefinition?.definition === cleanedDefinition;


    return (
        <li
            onClick={() => setActiveDefinition( null, cleanedDefinition )}
            style={{
                backgroundColor: isActive ? 'rgb(209, 224, 250)' : 'transparent',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '5px',
                width: 'fit-content',
            }}
        >
            {definition}
        </li>
    );
}

export default Definition;
