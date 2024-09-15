import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/ReviewCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Alert from "react-bootstrap/Alert";

function ReviewCreateForm({ course, setCourse, setReviews, profileImage, profile_id }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0); // New state for rating
  const [isEnrolled, setIsEnrolled] = useState(false); // Enrollment state
  const currentUser = useCurrentUser();
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch enrollment status when the component mounts
  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      try {
        const { data } = await axiosRes.get(`/enrollments/?course=${course}`);
        const isEnrolled = data.results.some(
          (enrollment) => enrollment.profile_id === currentUser?.profile_id
        );
        setIsEnrolled(isEnrolled);
      } catch (err) {
        //console.log("Error fetching enrollment status:", err);
        setErrorMessage(err.response?.data?.detail || 'Something went wrong');
      }
    };
    if (currentUser) {
      fetchEnrollmentStatus();
    }
  }, [course, currentUser]);

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  const handleChangeRating = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data: reviewData } = await axiosRes.post("/reviews/", {
        content: content.trim(),
        course,
      });

      // Store new data to the Rating model, associated with the new review
      await axiosRes.post("/ratings/", {
        rating: rating,
        course,
      });
      setReviews((prevReviews) => ({
        ...prevReviews,
        results: [reviewData, ...prevReviews.results],
      }));

      setCourse((prevCourse) => ({
        results: [
          {
            ...prevCourse.results[0],
            reviews_count: prevCourse.results[0].reviews_count + 1,
            ratings_count: prevCourse.results[0].ratings_count + 1,

          },
        ],
      }));

      setContent(""); // Reset review content
      setRating(0); // Reset rating field

    } catch (err) {
      //console.log("Error submitting review and rating:", err);
      setErrorMessage(err.response?.data?.detail);
    }
  };



  return (
    <>
      {isEnrolled ? (
        currentUser ? (
          <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
              <InputGroup>
                <Link to={`/profiles/${profile_id}`}>
                  <Avatar src={profileImage} />
                </Link>
                <Form.Control
                  className={styles.Form}
                  placeholder="Write your review..."
                  as="textarea"
                  value={content}
                  onChange={handleChangeContent}
                  rows={2}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                value={rating}
                onChange={handleChangeRating}
                min="0.1"
                max="10.0"
                step="0.1"
              />
            </Form.Group>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <button
              className={`${styles.Button} btn d-block ml-auto`}
              disabled={!content.trim() || rating <= 0}
              type="submit"
            >
              Post Review
            </button>
          </Form>
        ) : (
          <p>Please log in to write a review.</p>
        )
      ) : (
        <p>You need to be enrolled in this course to write a review.</p>
      )}
    </>
  );
}

export default ReviewCreateForm;
