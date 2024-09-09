import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/CommentCreateEditForm.module.css";
import Alert from "react-bootstrap/Alert";

function ReviewEditForm(props) {
    const { id, content, setShowEditForm, setReviews } = props;

    const [formContent, setFormContent] = useState(content);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        setFormContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.put(`/reviews/${id}/`, {
                content: formContent.trim(),
            });
            setReviews((prevReviews) => ({
                ...prevReviews,
                results: prevReviews.results.map((Review) => {
                    return Review.id === id
                        ? {
                            ...Review,
                            content: formContent.trim(),
                            updated_at: "now",
                        }
                        : Review;
                }),
            }));
            setShowEditForm(false);
        } catch (err) {
            console.log("Review Edit Form")
            console.log(err);
            setErrorMessage(err.response?.data?.detail || 'Something went wrong');
        }
    };
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="pr-1">
                <Form.Control
                    className={styles.Form}
                    as="textarea"
                    value={formContent}
                    onChange={handleChange}
                    rows={2}
                />
            </Form.Group>
            <div className="text-right">
                <button
                    className={styles.Button}
                    onClick={() => setShowEditForm(false)}
                    type="button"
                >
                    cancel
                </button>
                <button
                    className={styles.Button}
                    disabled={!content.trim()}
                    type="submit"
                >
                    save
                </button>
            </div>
        </Form>
    );
}

export default ReviewEditForm