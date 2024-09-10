import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/CommentCreateEditForm.module.css";
import Alert from "react-bootstrap/Alert";

function ReviewEditForm(props) {
  const { id, content, rating, setShowEditForm, setReviews } = props;

  const [formContent, setFormContent] = useState(content);
  const [formRating, setFormRating] = useState(rating); // New state for rating
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangeContent = (event) => {
    setFormContent(event.target.value);
  };

  const handleChangeRating = (event) => {
    setFormRating(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axiosRes.put(`/reviews/${id}/`, {
        content: formContent.trim(),
      });

      await axiosRes.put(`/ratings/${id}/`, {
        rating: formRating,
      });

      setReviews((prevReviews) => ({
        ...prevReviews,
        results: prevReviews.results.map((review) => {
          return review.id === id
            ? {
              ...review,
              content: formContent.trim(),  // Update the review content
              rating: formRating,            // Update the rating locally
              updated_at: "now",             // Update the timestamp
            }
            : review;
        }),
      }));

      // Close the edit form after successful submission
      setShowEditForm(false);

    } catch (err) {
      console.log("Error in Review Edit Form:", err);
      setErrorMessage(err.response?.data?.detail);
    }
  };



  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChangeContent}
          rows={2}
        />
      </Form.Group>
      <Form.Group className="pr-1">
        <Form.Label>Rating</Form.Label>
        <Form.Control
          type="number"
          value={formRating}
          onChange={handleChangeRating}
          min="0.1"
          max="10.0"
          step="0.1"
        />
      </Form.Group>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
          disabled={!formContent.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default ReviewEditForm;
