import { useCrossword } from '../../providers/CrosswordContext';
import React, { useState } from 'react';

function Definition({ definition }) {
    const { selectedDefinition, setActiveDefinition, definitionsUsed } = useCrossword();

    const cleanedDefinition = definition.replace(/^\d+\.\s/, '');


    const isActive = selectedDefinition?.definition === cleanedDefinition;

    const isCorrect = [...definitionsUsed.across, ...definitionsUsed.down].some(def =>
        def.text === cleanedDefinition && def.isAnswered
    );



    return (
        <li
            onClick={() => setActiveDefinition(null, cleanedDefinition)}
            style={{
                backgroundColor: isActive ? 'rgb(209, 224, 250)' : 'transparent',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '5px',
                width: 'fit-content',
                textDecoration: isCorrect ? 'line-through' : 'none'
            }}
        >
            {definition}
        </li>
    );
}

export default Definition;
