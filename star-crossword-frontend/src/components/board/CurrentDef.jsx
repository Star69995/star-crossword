import React from 'react';
import { useCrossword } from '../../providers/CrosswordContext';
function CurrentDef() {
    const { selectedDefinition } = useCrossword();

    const def = selectedDefinition?.definition || 'כאן תופיעה ההגדרה המסומנת';
    // console.log(def);
    return (
        <div
            className="p-2 border border-info shadow-lg bg-info-subtle">
            <span>{def}</span>
        </div>
    );
}

export default CurrentDef;