import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function ReviewCreateForm(props) {
    const { course, setPost, setReviews, profileImage, profile_id } = props;
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axiosRes.post("/reviews/", {
                content: content.trim(),
                course,
            });
            setReviews((prevReviews) => ({
                ...prevReviews,
                results: prevReviews?.results ? [data, ...prevReviews.results] : [data],
            }));
            setPost((prevPost) => ({
                results: [
                    {
                        ...prevPost.results[0],
                        reviews_count: prevPost.results[0].reviews_count + 1,
                    },
                ],
            }));
            setContent(""); // Reset the form content
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to post review');
            console.log(err);
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/profiles/${profile_id}`}>
                        <Avatar src={profileImage} />
                    </Link>
                    <Form.Control
                        className={styles.Form}
                        placeholder="my review..."
                        as="textarea"
                        value={content}
                        onChange={handleChange}
                        rows={2}
                    />
                </InputGroup>
            </Form.Group>
            {error && <div className="text-danger">{error}</div>}
            <button
                className={`${styles.Button} btn d-block ml-auto`}
                disabled={content.trim().length < 1}
                type="submit"
            >
                Post your review
            </button>
        </Form>
    );
}

export default ReviewCreateForm;
