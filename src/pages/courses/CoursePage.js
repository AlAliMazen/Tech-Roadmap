import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Course from "./Course";
import Review from "../reviews/Review";
import ReviewCreateForm from "../reviews/ReviewCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import Alert from "react-bootstrap/Alert";

function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [reviews, setReviews] = useState({ results: [] });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: course }, { data: reviews }] = await Promise.all([
          axiosReq.get(`/courses/${id}`),
          axiosReq.get(`/reviews/?course=${id}`),
        ]);
        setCourse({ results: [course] });
        setReviews(reviews);

      } catch (err) {
        setErrorMessage(err.response?.data?.detail || "Error loading course data.");
      }
    };

    handleMount();
  }, [id, currentUser]);
  
  // Auto-hide error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);


  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        {/* Show course details */}
        <Course
          {...course.results[0]}
          setCourse={setCourse}
          coursePage
        />

        <Container className={appStyles.Content}>
          {/* If the user is enrolled, show the review form */}
          {currentUser  ? (
            <ReviewCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              course={id}
              setCourse={setCourse}
              setReviews={setReviews}
            />
          ) : reviews.results.length ? (
            "Reviews"
          ) : null}
          {reviews.results.length ? (
            <InfiniteScroll
              children={reviews.results.map((review) => (
                <Review
                  key={review.id}
                  {...review}
                  setCourse={setCourse}
                  setReviews={setReviews}
                />
              ))}
              dataLength={reviews.results.length}
              loader={<Asset spinner />}
              hasMore={!!reviews.next}
              next={() => fetchMoreData(reviews, setReviews)}
            />
          ) : currentUser  ? (
            <span>No reviews yet, be the first to review this course!</span>
          ) : (
            <span>No reviews... yet</span>
          )}
        </Container>
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
            {errorMessage}
          </Alert>
        )}
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default CoursePage;
