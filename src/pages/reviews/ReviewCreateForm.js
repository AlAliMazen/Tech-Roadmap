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
        console.log("Error fetching enrollment status:", err);
        setErrorMessage(err.response?.data?.detail || 'Something went wrong');
      }
    };

    if (currentUser) {
      fetchEnrollmentStatus();
    }
  }, [course, currentUser]);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/reviews/", {
        content,
        course,
      });
      setReviews((prevReviews) => ({
        ...prevReviews,
        results: [data, ...prevReviews.results],
      }));
      setCourse((prevCourse) => ({
        results: [
          {
            ...prevCourse.results[0],
            reviews_count: prevCourse.results[0].reviews_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
      console.log("Error submitting review:", err);
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
                  onChange={handleChange}
                  rows={2}
                />
              </InputGroup>
            </Form.Group>
            <button
              className={`${styles.Button} btn d-block ml-auto`}
              disabled={!content.trim()}
              type="submit"
            >
              Post Review
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
