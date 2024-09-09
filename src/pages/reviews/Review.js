import React, { useState } from "react";
import Media from "react-bootstrap/Media";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import ReviewEditForm from "./ReviewEditForm";

import styles from "../../styles/Review.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

const Review = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    rating,
    id,
    setCourse,
    setReviews,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/reviews/${id}/`);
      setCourse((prevCourse) => ({
        results: [
          {
            ...prevCourse.results[0],
            reviews_count: prevCourse.results[0].reviews_count - 1,
          },
        ],
      }));

      setReviews((prevReviews) => ({
        ...prevReviews,
        results: prevReviews.results.filter((review) => review.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete the review:", err);
    }
  };

  return (
    <>
      <hr />
      <Media>
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
