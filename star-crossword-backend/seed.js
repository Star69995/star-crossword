// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./model/userModel.js";
import { WordList } from "./model/wordListModel.js";
import { Crossword } from "./model/crosswordModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        // ננקה קולקציות
        await User.deleteMany({});
        await WordList.deleteMany({});
        await Crossword.deleteMany({});

        // --- צרו משתמשים ---
        const users = await User.insertMany([
            {
                email: "admin@test.com",
                password: "$2b$12$WYcUuBidyNfNVVjagGPhFea9KHfTwG3dO3fzb/2.cpywcWHxwdBem",
                userName: "Admin",
                isContentCreator: true,
            },
            {
                email: "user@test.com",
                password: "$2b$12$WYcUuBidyNfNVVjagGPhFea9KHfTwG3dO3fzb/2.cpywcWHxwdBem",
                userName: "RegularUser",
                isContentCreator: false,
            },
        ]);

        const admin = users[0];

        // --------------------------------------------------------------------
        // 📌 רשימות המילים - חיות
        // --------------------------------------------------------------------
        const animalsList = {
            title: "חיות",
            description: "רשימה של חיות",
            isPublic: true,
            creator: admin._id,
            words: [
                { solution: "חתול", definition: "חיית מחמד פרוותית" },
                { solution: "כלב", definition: "חברו הטוב של האדם" },
                { solution: "פיל", definition: "היונק היבשתי הגדול ביותר" },
                { solution: "אריה", definition: "מלך החיות" },
                { solution: "נמר", definition: "חתול גדול עם פסים שחורים" },
                { solution: "ג'ירפה", definition: "החיה הגבוהה ביותר בעולם" },
                { solution: "זברה", definition: "סוס עם פסים שחור-לבן" },
                { solution: "קוף", definition: "יונק פיקח עם זנב ארוך" },
                { solution: "תנין", definition: "זוחל מסוכן שחי במים וביבשה" },
                { solution: "דולפין", definition: "יונק ימי אינטליגנטי וידידותי" },
                { solution: "כריש", definition: "דג טורף עם שורות שיניים חדות" },
                { solution: "לוויתן", definition: "היונק הימי הגדול ביותר" },
                { solution: "צבי", definition: "חיה עם שריון על הגב" },
                { solution: "ינשוף", definition: "ציפור לילה חכמה" },
                { solution: "נשר", definition: "ציפור טרף גדולה" },
                { solution: "דב", definition: "יונק גדול שאוהב דבש" },
                { solution: "שועל", definition: "יונק קטן ופיקח עם פרווה אדמדמה" },
                { solution: "זאב", definition: "קרוב משפחה של הכלב שחי בלהקות" },
                { solution: "גמל", definition: "בעל חיים מדברי עם דבשת" },
                { solution: "סוס", definition: "חיית משא ורכיבה נאמנה" },
                { solution: "פרה", definition: "חיית משק שמייצרת חלב" },
                { solution: "כבשה", definition: "בעל חיים עם צמר רך" },
                { solution: "עז", definition: "בעל חיים הררי שאוהב לטפס" },
                { solution: "תרנגול", definition: "העוף שמכריז על הזריחה" },
                { solution: "תוכי", definition: "ציפור צבעונית שמסוגלת לחקות דיבור" },
                { solution: "פינגווין", definition: "עוף חסר יכולת תעופה שחי בקור" },
                { solution: "עטלף", definition: "היונק המעופף היחיד" },
                { solution: "לטאה", definition: "זוחל קטן ומהיר" },
                { solution: "ארנב", definition: "יונק קטן עם אוזניים ארוכות" },
                { solution: "צ'יטה", definition: "בעל החיים היבשתי המהיר ביותר" },
            ],
        };

        // --------------------------------------------------------------------
        // 📌 רשימות המילים - מדינות (מלא)
        // --------------------------------------------------------------------
        const countriesList = {
            title: "מדינות",
            description: "רשימה של מדינות",
            isPublic: true,
            creator: admin._id,
            words: [
                { solution: "ישראל", definition: "מדינה במזרח התיכון" },
                { solution: "צרפת", definition: "מדינה באירופה" },
                { solution: "ארצות הברית", definition: "מדינה בצפון אמריקה עם 50 מדינות" },
                { solution: "סין", definition: "המדינה המאוכלסת ביותר בעולם" },
                { solution: "הודו", definition: "מדינה בדרום אסיה עם אוכלוסייה עצומה" },
                { solution: "רוסיה", definition: "המדינה הגדולה ביותר בעולם בשטח" },
                { solution: "ברזיל", definition: "המדינה הגדולה ביותר בדרום אמריקה" },
                { solution: "גרמניה", definition: "מדינה במרכז אירופה עם כלכלה חזקה" },
                { solution: "קנדה", definition: "מדינה בצפון אמריקה עם שטח עצום ואוכלוסייה קטנה יחסית" },
                { solution: "יפן", definition: "מדינת איים במזרח אסיה עם תרבות עשירה" },
                { solution: "איטליה", definition: "מדינה באירופה הידועה בהיסטוריה, אומנות ואוכל" },
                { solution: "מצרים", definition: "מדינה בצפון אפריקה עם היסטוריה פרעונית עשירה" },
                { solution: "בריטניה", definition: "מדינה באירופה הכוללת את אנגליה, סקוטלנד, וויילס וצפון אירלנד" },
                { solution: "ספרד", definition: "מדינה בדרום אירופה הידועה בפלמנקו" },
                { solution: "אוסטרליה", definition: "מדינה שהיא גם יבשת" },
                { solution: "ארגנטינה", definition: "מדינה בדרום אמריקה עם תשוקה לכדורגל" },
                { solution: "תאילנד", definition: "מדינה בדרום מזרח אסיה עם חופים מרהיבים" },
                { solution: "דרום אפריקה", definition: "מדינה בקצה הדרומי של אפריקה" },
                { solution: "מקסיקו", definition: "מדינה בצפון אמריקה הידועה בטקילה" },
                { solution: "טורקיה", definition: "מדינה החולשת בין אירופה לאסיה" },
                { solution: "יוון", definition: "מדינה בדרום אירופה עם היסטוריה עתיקה" },
                { solution: "שוודיה", definition: "מדינה בצפון אירופה" },
                { solution: "נורבגיה", definition: "מדינה סקנדינבית עם פיורדים" },
                { solution: "פינלנד", definition: "מדינה בצפון אירופה" },
                { solution: "דנמרק", definition: "מדינה בצפון אירופה" },
                { solution: "פורטוגל", definition: "מדינה בדרום-מערב אירופה" },
                { solution: "פולין", definition: "מדינה במזרח אירופה" },
                { solution: "צ'כיה", definition: "מדינה במרכז אירופה" },
                { solution: "בלגיה", definition: "מדינה במערב אירופה" },
                { solution: "שווייץ", definition: "מדינה במרכז אירופה" },
                { solution: "הולנד", definition: "מדינה באירופה" },
                { solution: "אוסטריה", definition: "מדינה באירופה" },
                { solution: "הונגריה", definition: "מדינה במרכז אירופה" },
                { solution: "רומניה", definition: "מדינה במזרח אירופה" },
                { solution: "בולגריה", definition: "מדינה במזרח אירופה" },
                { solution: "סעודיה", definition: "מדינה במזרח התיכון" },
                { solution: "איחוד האמירויות", definition: "מדינה במפרץ הפרסי" },
                { solution: "קטאר", definition: "מדינה קטנה במפרץ הפרסי" },
                { solution: "מרוקו", definition: "מדינה בצפון אפריקה" },
                { solution: "אלג'יריה", definition: "המדינה הגדולה ביותר באפריקה" },
                { solution: "ניגריה", definition: "המדינה המאוכלסת ביותר באפריקה" },
                { solution: "קניה", definition: "מדינה במזרח אפריקה עם חיות בר" },
                { solution: "אתיופיה", definition: "מדינה במזרח אפריקה" },
                { solution: "קולומביה", definition: "מדינה בדרום אמריקה עם קפה מצוין" },
                { solution: "ונצואלה", definition: "מדינה בדרום אמריקה עם נפט" },
                { solution: "צ'ילה", definition: "מדינה בדרום אמריקה" },
                { solution: "פרו", definition: "מדינה בדרום אמריקה" },
                { solution: "בוליביה", definition: "מדינה בדרום אמריקה" },
            ],
        };

        // --------------------------------------------------------------------
        // 📌 רשימות המילים - כללי
        // --------------------------------------------------------------------
        const generalList = {
            title: "כללי",
            description: "רשימה שמכילה כמה הגדרות כלליות שקשורות לישראל",
            isPublic: true,
            creator: admin._id,
            words: [
                { solution: "ירושלים", definition: "בירת ישראל" },
                { solution: "התיכון", definition: "הים הגדול של ישראל" },
                { solution: "תפוז", definition: "פרי כתום שמתחיל באות תפ" },
                { solution: "ברדלס", definition: "החיה הכי מהירה ביבשה" },
                { solution: "ירדן", definition: "נהר שחוצה את ישראל" },
                { solution: "ירוק", definition: "צבע של דשא" },
                { solution: "גיטרה", definition: "כלי נגינה עם מיתרים" },
                { solution: "תשרי", definition: "החודש הראשון בלוח העברי" },
                { solution: "פלאפל", definition: "מאכל מחומוס" },
                { solution: "לויתן", definition: "יונק ימי גדול" },
                { solution: "טלפון", definition: "מכשיר לתקשורת" },
                { solution: "כדורגל", definition: "ספורט קבוצתי עם כדור" },
                { solution: "פריז", definition: "עיר הבירה של צרפת" },
                { solution: "אדום", definition: "צבע של דם" },
                { solution: "קפה", definition: "משקה חם עם קפאין" },
                { solution: "כלב", definition: "חיית מחמד שנובחת" },
                { solution: "סכין", definition: "כלי מטבח לחיתוך" },
                { solution: "פסח", definition: "חג בו אוכלים מצות" },
                { solution: "שמש", definition: "הכוכב שסביבו מקיף כדור הארץ" },
                { solution: "אפריקה", definition: "היבשת שבה נמצאת מצרים" },
                { solution: "חיפה", definition: "עיר הנמל הראשית של ישראל" },
            ],
        };

        // שומרים את רשימות המילים
        await WordList.insertMany([animalsList, countriesList, generalList]);

        // --------------------------------------------------------------------
        // 📌 תשבץ
        // --------------------------------------------------------------------
        const crossword = {
            title: "תשבץ לדוגמה",
            description: "תשבץ שנוצר ע\"י seed",
            isPublic: true,
            creator: admin._id,
            crosswordObject: {
                "gridData": {
                    "grid": [
                        [
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ת",
                                "definitions": [
                                    {
                                        "definition": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": 3,
                                "wordIndex": 2
                            },
                            {
                                "solution": "א",
                                "definitions": [
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    },
                                    {
                                        "definition": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": 2,
                                "wordIndex": 2
                            },
                            {
                                "solution": "י",
                                "definitions": [
                                    {
                                        "definition": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 2
                            },
                            {
                                "solution": "ל",
                                "definitions": [
                                    {
                                        "definition": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 2
                            },
                            {
                                "solution": "נ",
                                "definitions": [
                                    {
                                        "definition": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 2
                            },
                            {
                                "solution": "ד",
                                "definitions": [
                                    {
                                        "definition": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                                        "isVertical": false
                                    },
                                    {
                                        "definition": "יונק גדול שאוהב דבש",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": 7,
                                "wordIndex": 7
                            }
                        ],
                        [
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ו",
                                "definitions": [
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 1
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ב",
                                "definitions": [
                                    {
                                        "definition": "יונק גדול שאוהב דבש",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 7
                            }
                        ],
                        [
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ר",
                                "definitions": [
                                    {
                                        "definition": "המדינה הגדולה ביותר בעולם בשטח",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": 4,
                                "wordIndex": 3
                            },
                            {
                                "solution": "ו",
                                "definitions": [
                                    {
                                        "definition": "המדינה הגדולה ביותר בעולם בשטח",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 3
                            },
                            {
                                "solution": "ס",
                                "definitions": [
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    },
                                    {
                                        "definition": "המדינה הגדולה ביותר בעולם בשטח",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 3
                            },
                            {
                                "solution": "י",
                                "definitions": [
                                    {
                                        "definition": "המדינה הגדולה ביותר בעולם בשטח",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 3
                            },
                            {
                                "solution": "ה",
                                "definitions": [
                                    {
                                        "definition": "המדינה הגדולה ביותר בעולם בשטח",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 3
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            }
                        ],
                        [
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ט",
                                "definitions": [
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 1
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            }
                        ],
                        [
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ח",
                                "definitions": [
                                    {
                                        "definition": "חיית מחמד פרוותית",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": 5,
                                "wordIndex": 4
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ר",
                                "definitions": [
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 1
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            }
                        ],
                        [
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ת",
                                "definitions": [
                                    {
                                        "definition": "חיית מחמד פרוותית",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 4
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ז",
                                "definitions": [
                                    {
                                        "definition": "קרוב משפחה של הכלב שחי בלהקות",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": 6,
                                "wordIndex": 6
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ל",
                                "definitions": [
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 1
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            }
                        ],
                        [
                            {
                                "solution": "ד",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": 1,
                                "wordIndex": 0
                            },
                            {
                                "solution": "ר",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 0
                            },
                            {
                                "solution": "ו",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    },
                                    {
                                        "definition": "חיית מחמד פרוותית",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 4
                            },
                            {
                                "solution": "ם",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 0
                            },
                            {
                                "solution": "א",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    },
                                    {
                                        "definition": "קרוב משפחה של הכלב שחי בלהקות",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 6
                            },
                            {
                                "solution": "פ",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 0
                            },
                            {
                                "solution": "ר",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 0
                            },
                            {
                                "solution": "י",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    },
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 1
                            },
                            {
                                "solution": "ק",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 0
                            },
                            {
                                "solution": "ה",
                                "definitions": [
                                    {
                                        "definition": "מדינה בקצה הדרומי של אפריקה",
                                        "isVertical": false
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 0
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            }
                        ],
                        [
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ל",
                                "definitions": [
                                    {
                                        "definition": "חיית מחמד פרוותית",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 4
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ב",
                                "definitions": [
                                    {
                                        "definition": "קרוב משפחה של הכלב שחי בלהקות",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 6
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": "ה",
                                "definitions": [
                                    {
                                        "definition": "מדינה שהיא גם יבשת",
                                        "isVertical": true
                                    }
                                ],
                                "isHighlighted": false,
                                "definitionNumber": null,
                                "wordIndex": 1
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            },
                            {
                                "solution": null,
                                "definitions": [],
                                "isHighlighted": false,
                                "definitionNumber": null
                            }
                        ]
                    ],
                    "definitionsUsed": {
                        "across": [
                            {
                                "number": 1,
                                "text": "מדינה בקצה הדרומי של אפריקה",
                                "isAnswered": false
                            },
                            {
                                "number": 3,
                                "text": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                                "isAnswered": false
                            },
                            {
                                "number": 4,
                                "text": "המדינה הגדולה ביותר בעולם בשטח",
                                "isAnswered": false
                            }
                        ],
                        "down": [
                            {
                                "number": 2,
                                "text": "מדינה שהיא גם יבשת",
                                "isAnswered": false
                            },
                            {
                                "number": 5,
                                "text": "חיית מחמד פרוותית",
                                "isAnswered": false
                            },
                            {
                                "number": 6,
                                "text": "קרוב משפחה של הכלב שחי בלהקות",
                                "isAnswered": false
                            },
                            {
                                "number": 7,
                                "text": "יונק גדול שאוהב דבש",
                                "isAnswered": false
                            }
                        ]
                    },
                    "wordPositions": [
                        {
                            "wordIndex": 0,
                            "definition": "מדינה בקצה הדרומי של אפריקה",
                            "row": 6,
                            "col": 1,
                            "isVertical": false,
                            "definitionNumber": 1
                        },
                        {
                            "wordIndex": 1,
                            "definition": "מדינה שהיא גם יבשת",
                            "row": 0,
                            "col": 8,
                            "isVertical": true,
                            "definitionNumber": 2
                        },
                        {
                            "wordIndex": 2,
                            "definition": "מדינה בדרום מזרח אסיה עם חופים מרהיבים",
                            "row": 0,
                            "col": 7,
                            "isVertical": false,
                            "definitionNumber": 3
                        },
                        {
                            "wordIndex": 3,
                            "definition": "המדינה הגדולה ביותר בעולם בשטח",
                            "row": 2,
                            "col": 6,
                            "isVertical": false,
                            "definitionNumber": 4
                        },
                        {
                            "wordIndex": 4,
                            "definition": "חיית מחמד פרוותית",
                            "row": 4,
                            "col": 3,
                            "isVertical": true,
                            "definitionNumber": 5
                        },
                        {
                            "wordIndex": 6,
                            "definition": "קרוב משפחה של הכלב שחי בלהקות",
                            "row": 5,
                            "col": 5,
                            "isVertical": true,
                            "definitionNumber": 6
                        },
                        {
                            "wordIndex": 7,
                            "definition": "יונק גדול שאוהב דבש",
                            "row": 0,
                            "col": 12,
                            "isVertical": true,
                            "definitionNumber": 7
                        }
                    ]


                }
            },
        };

        await Crossword.create(crossword);

        console.log("✅ Seed data inserted!");
    } catch (err) {
        console.error("❌ Error while seeding:", err);
    } finally {
        mongoose.connection.close();
    }
};

seed();