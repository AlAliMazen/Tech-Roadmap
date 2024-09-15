import React, { useState } from "react";
import Media from "react-bootstrap/Media";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import ReviewEditForm from "./ReviewEditForm";

import styles from "../../styles/Review.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import Alert from "react-bootstrap/Alert";

const Review = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    rating,
    id,
    course_id,
    setCourse,
    setReviews,
    setRatings
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/reviews/${id}/`);
      await axiosRes.delete(`/ratings/${id}/`);
      setCourse((prevCourse) => ({
        results: [
          {
            ...prevCourse.results[0],
            reviews_count: prevCourse.results[0].reviews_count - 1,
            ratings_count: prevCourse.results[0].ratings_count - 1, // Decrement the ratings count
          },
        ],
      }));
      setReviews((prevReviews) => ({
        ...prevReviews,
        results: prevReviews.results.filter((review) => review.id !== id),
      }));
      setRatings((prevRatings) => ({
        ...prevRatings,
        results: prevRatings.results.filter((rating) => rating.id !== id),
      }));
      console.log("Course ID : ", course_id)
      console.log("rating : ", rating)
    } catch (err) {
      console.error("Failed to delete the review and rating:", err);
      setErrorMessage(err.response?.data?.detail || 'Something went wrong');
    }
  };


  return (
    <>
      <hr />
      <Media>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          <div className={styles.Rating}>
            <strong>Rating: </strong>{rating}/10
          </div>
          {showEditForm ? (
            <ReviewEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              setRatings={setRatings}
              course_id={course_id}
              rating={rating}
              profileImage={profile_image}
              setReviews={setReviews}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <>
              <p>{content}</p>
            </>
          )}
          {console.log("Course ID:",course_id )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
};

export default Review;
