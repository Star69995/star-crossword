import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWordListById } from "../services/api";
import { useAuth } from "../providers/AuthContext";

const WordListView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [wordList, setWordList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        const fetchWordList = async () => {
            try {
                const wl = await getWordListById(id);
                setWordList(wl);
            } catch (error) {
                console.log('error: ', error);
                setLoadError("שגיאה בטעינת הרשימה");
            } finally {
                setLoading(false);
            }
        };
        fetchWordList();
    }, [id]);

    if (loading) return <div>טוען...</div>;
    if (loadError) return <div className="alert alert-danger">{loadError}</div>;
    if (!wordList) return <div>לא נמצאה רשימה</div>;

    // הרשאת עריכה
    const canEdit =
        user && (user._id === wordList.creator._id ||
            user._id === wordList.creator); // תמיכה גם במקרים בהם creator הוא רק id

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="card-title mb-0">{wordList.title}</h2>
                                <div className="small">
                                    יוצר: {wordList.creator?.userName || "לא ידוע"} |{" "}
                                    {new Date(wordList.createdAt).toLocaleDateString("he-IL")}
                                    {wordList.isPublic && <span className="badge bg-success ms-2">ציבורית</span>}
                                </div>
                            </div>
                            {canEdit && (
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => navigate(`/edit-wordlist/${wordList._id}`)}
                                >
                                    <i className="bi bi-pencil"></i> עריכת רשימה
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <p>{wordList.description}</p>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "20%" }}>מילה</th>
                                            <th>הגדרה</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(wordList.words || []).length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="text-center text-muted">
                                                    אין מילים ברשימה זו
                                                </td>
                                            </tr>
                                        ) : (
                                            wordList.words.map((word, idx) => (
                                                <tr key={word._id || idx}>
                                                    <td className="fw-bold">{word.solution}</td>
                                                    <td>{word.definition || "-"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                <div className="text-end text-muted small">
                                    {wordList.words?.length || 0} מילים
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordListView;