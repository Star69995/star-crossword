import definitions from '../assets/definitions.json';
import countries from '../assets/countries.json';
import animals from '../assets/animals.json';

const wordLists = {
	default: { name: "בדיקה", words: definitions.crossword
    },
	animals: {
		name: "בעלי חיים",
		words: animals.crossword
    },
	countries: {
		name: "מדינות",
		words: countries.crossword
    },
	custom: { name: "מותאם אישית", words: ""
    },
};

export default wordLists;
