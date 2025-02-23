import Definition from "./Definition";
import { useCrossword } from "../providers/CrosswordContext";

function DefinitionsArea() {
    const { definitions } = useCrossword();

    if (!definitions?.across || !definitions?.down) {
        return (
            <div className="mt-6 space-y-2">
                <h2>הגדרות:</h2>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-2">
            <h2>הגדרות:</h2>

            <div
                style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div>
                <h3>מאוזן:</h3>
                <ul style={{ textAlign: "right", listStyle: 'none' }}>
                    {definitions.across.map((def) => (
                        <Definition
                            key={def.number}
                            definition={`${def.number}. ${def.text}`}
                        />
                    ))}
                </ul>
            </div>

            <div>
                <h3>מאונך:</h3>
                <ul style={{ textAlign: "right", listStyle: 'none' }}>
                    {definitions.down.map((def) => (
                        <Definition
                            key={def.number}
                            definition={`${def.number}. ${def.text}`}
                        />
                    ))}
                </ul>
            </div>
            </div>
        </div>
    );
}

export default DefinitionsArea;