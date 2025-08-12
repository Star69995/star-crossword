import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { createCrossword, updateCrossword, getMyWordLists } from "../../../services/api";
import FormCard from "../FormCard";
import WordListsPicker from "./WordListsPicker";

const CrosswordForm = ({ initialData, onSubmit }) => {
    const navigate = useNavigate();
    const [wordLists, setWordLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [customErrors, setCustomErrors] = useState({});
    const [fieldsState, setFieldsState] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        size: initialData?.size || 15,
        wordListIds: initialData?.wordListIds || [],
        isPublic: initialData?.isPublic || false,
    });

    const isEdit = Boolean(initialData && initialData._id);

    useEffect(() => {
        // Only fetch word lists if it's not editing
        if (!isEdit) {
            fetchWordLists();
        }
        // Update form state if initialData changes
        if (initialData) {
            setFieldsState({
                title: initialData.title || "",
                description: initialData.description || "",
                size: initialData.size || 15,
                wordListIds: initialData.wordListIds || [],
                isPublic: initialData.isPublic || false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const fetchWordLists = async () => {
        try {
            const data = await getMyWordLists();
            setWordLists(data);
        } catch (error) {
            console.error('שגיאה בשליפת רשימות מילים', error);
        }
    };

    // Filter fields for creation or edit mode
    const allFields = [
        {
            name: "title",
            label: "כותרת התשבץ",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "תיאור (אופציונלי)",
            type: "textarea",
            rows: 3,
            required: false,
        },
        {
            name: "size",
            label: "גודל הלוח",
            type: "select",
            required: true,
            options: [
                { value: 13, label: "13x13" },
                { value: 15, label: "15x15" },
                { value: 17, label: "17x17" },
                { value: 21, label: "21x21" },
            ],
        },
        {
            name: "isPublic",
            label: "תשבץ ציבורי (אחרים יוכלו לראות ולפתור את התשבץ)",
            type: "checkbox",
            required: false,
        },
    ];

    // Filter visible fields
    const fields = isEdit
        ? allFields.filter(f => ["title", "description", "isPublic"].includes(f.name))
        : allFields;

    const handleFieldChange = (name, value) => {
        setFieldsState((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCustomErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleFormSubmit = async (data) => {
        setSubmitError("");
        let localErrors = {};

        if (!data.title.trim()) {
            localErrors.title = "יש להזין כותרת תשבץ";
        }
        if (!isEdit && !data.size) {
            localErrors.size = "יש לבחור גודל לוח";
        }
        if (!isEdit && (!data.wordListIds || data.wordListIds.length === 0)) {
            localErrors.wordListIds = "יש לבחור לפחות רשימת מילים אחת";
        }

        setCustomErrors(localErrors);

        if (Object.keys(localErrors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            // Send only what allowed
            if (onSubmit) {
                // Remove size/wordListIds if not relevant (edit mode)
                let payload = { ...data };
                if (isEdit) {
                    delete payload.size;
                    delete payload.wordListIds;
                } else {
                    payload.wordListIds = fieldsState.wordListIds;
                }
                await onSubmit(payload);
            } else if (isEdit) {
                await updateCrossword(initialData._id, {
                    title: data.title,
                    description: data.description,
                    isPublic: data.isPublic,
                });
            } else {
                await createCrossword(data);
            }
            navigate("/my-crosswords");
        } catch (error) {
            console.log('error: ', error);
            setSubmitError(isEdit ? "שגיאה בעדכון התשבץ" : "שגיאה ביצירת התשבץ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="card-title mb-0">
                                {isEdit ? "עריכת תשבץ" : "יצירת תשבץ חדש"}
                            </h2>
                        </div>
                        <div className="card-body">
                            <FormCard
                                fields={fields}
                                initialValues={fieldsState}
                                loading={loading}
                                error={submitError}
                                onSubmit={handleFormSubmit}
                                submitLabel={isEdit ? "עדכן תשבץ" : "צור תשבץ"}
                                cancelLabel="ביטול"
                                onCancel={() => navigate("/my-crosswords")}
                            >
                                {!isEdit && (
                                    <WordListsPicker
                                        wordLists={wordLists}
                                        value={fieldsState.wordListIds}
                                        onChange={(ids) => handleFieldChange("wordListIds", ids)}
                                        error={customErrors.wordListIds}
                                        required
                                        onCreateNew={() => navigate("/create-wordlist")}
                                    />
                                )}
                            </FormCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CrosswordForm.propTypes = {
    initialData: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        description: PropTypes.string,
        size: PropTypes.oneOf([13, 15, 17, 21]),
        wordListIds: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        ),
        isPublic: PropTypes.bool,
    }),
    onSubmit: PropTypes.func,
};

export default CrosswordForm;