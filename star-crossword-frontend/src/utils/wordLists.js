import definitions from '../assets/crossword_definitions_lists/test.json';
import countries from '../assets/crossword_definitions_lists/countries.json';
import animals from '../assets/crossword_definitions_lists/animals.json';

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
