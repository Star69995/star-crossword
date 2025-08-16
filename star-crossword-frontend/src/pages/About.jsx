const About = () => {
    return (
        <div className="container my-5" style={{ direction: "rtl", textAlign: "right" }}>
            <div className="row mb-4">
                <div className="col">
                    <h1>⭐ סטאר תשבצים</h1>
                    <p className="lead">
                        פלטפורמת תשבצים אינטרנטית המאפשרת יצירה, פתרון ושיתוף של תשבצים –
                        עם מערכת ניהול משתמשים, תמיכה בריבוי שפות (כולל RTL), ועיצוב רספונסיבי
                        למחשב ולמובייל.
                    </p>
                </div>
            </div>

            {/* תיאור כללי */}
            <div className="row mb-4">
                <div className="col">
                    <h3>📖 תיאור כללי</h3>
                    <p>
                        Star Crossword הוא פרויקט גמר הבנוי מ־{" "}
                        <b>צד שרת (Node.js + Express + MongoDB)</b> ו־
                        <b>צד לקוח (React + Vite)</b>.
                    </p>
                    <ul>
                        <li>✏️ יצירת תשבצים חדשים ע"י משתמשים בעלי הרשאת <b>Content Creator</b></li>
                        <li>🧩 פתרון תשבצים בזמן אמת עם ממשק גרפי</li>
                        <li>⭐ סימון תשבצים או רשימות מילים כמועדפים</li>
                        <li>🌍 גלישה בתשבצים ציבוריים ובהעדפות האישיות שלך</li>
                        <li>🔐 הרשאות משתמשים (User / Creator / Admin)</li>
                        <li>🔑 מערכת הרשמה והתחברות מאובטחת עם JWT</li>
                    </ul>
                </div>
            </div>

            {/* צד שרת */}
            <div className="row mb-4">
                <div className="col">
                    <h3>🖥️ צד שרת (Backend)</h3>
                    <p>נבנה עם:</p>
                    <ul>
                        <li>Node.js + Express לניהול API</li>
                        <li>MongoDB + Mongoose לניהול בסיס נתונים</li>
                        <li>jsonwebtoken (JWT) לאימות</li>
                        <li>bcrypt להצפנת סיסמאות</li>
                        <li>Cors + Morgan לניהול אבטחה ולוגים</li>
                    </ul>
                    <div className="card">
                        <div className="card-body">
                            <b>Endpoints עיקריים:</b>
                            <ul>
                                <li>/api/users → הרשמה וניהול משתמשים</li>
                                <li>/api/login → התחברות וקבלת Token</li>
                                <li>/api/crosswords → ניהול תשבצים</li>
                                <li>/api/wordlists → ניהול רשימות מילים</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* צד לקוח */}
            <div className="row mb-4">
                <div className="col">
                    <h3>🎨 צד לקוח (Frontend)</h3>
                    <p>נבנה עם:</p>
                    <ul>
                        <li>React (Vite)</li>
                        <li>Bootstrap / Material Design</li>
                        <li>Bootstrap Icons</li>
                    </ul>
                    <p><b>פיצ'רים עיקריים בצד לקוח:</b></p>
                    <ul>
                        <li>📱 עיצוב רספונסיבי</li>
                        <li>🔑 התחברות + הרשמה עם Regex לסיסמאות</li>
                        <li>🔄 CRUD מלא לכל סוגי התוכן</li>
                        <li>⭐ מועדפים נשמרים בבסיס נתונים</li>
                        <li>📑 דף אודות מפורט</li>
                        <li>🔍 שדה חיפוש ותצוגות סינון</li>
                        <li>🔐 הרשאות מותנות לפי Token</li>
                    </ul>
                </div>
            </div>

            {/* הרשאות */}
            <div className="row mb-4">
                <div className="col">
                    <h3>👥 סוגי משתמשים והרשאות</h3>
                    <ul>
                        <li><b>משתמש רגיל:</b> יכול לגלוש, לפתור תשבצים ולסמן מועדפים.</li>
                        <li><b>יוצר תוכן:</b> יכול ליצור, לערוך ולמחוק תשבצים ורשימות מילים.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;