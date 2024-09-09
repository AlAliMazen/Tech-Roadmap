import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { axiosReq } from '../../api/axiosDefaults';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Course.module.css";
import appStyles from "../../App.module.css";
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Accordion, Button } from "react-bootstrap";
import Review from "../reviews/Review";
import ReviewCreateForm from "../reviews/ReviewCreateForm";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

const CoursePage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const currentUser = useCurrentUser();
    const [reviews, setReviews] = useState({ results: [] });
    const [post, setPost] = useState({ results: [] });


    const modules = {
        toolbar: false
    }
    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{ data: courseData }, { data: enrollmentData }, { data: ratingsData }, { data: reviewsData }] = await Promise.all([
                    axiosReq.get(`/courses/${id}`),
                    axiosReq.get('/enrollments/'),
                    axiosReq.get(`/ratings/`),
                    axiosReq.get(`/reviews/?course=${id}`),
                ]);
                setCourse(courseData);
                setEnrollments(enrollmentData.results); // Set the enrollments
                setRatings(ratingsData.results); // Set ratings
                setReviews(reviewsData.results);

                setHasLoaded(true)
            } catch (err) {
                setErrorMessage(err.response?.data?.detail || 'Something went wrong'); // Fallback error message
            }
        };

        handleMount();
    }, [id]);

    const getRating = (courseId) => {
        // Filter the ratings that belong to this course
        const courseRatings = ratings.filter(rating => String(rating.course) === String(courseId));
        if (courseRatings.length > 0) {
            const totalRating = courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
            const average = totalRating / courseRatings.length;
            return average.toFixed(1);
        }
        return 0;
    };

    // Set the average rating once the ratings are fetched
    useEffect(() => {
        if (ratings.length > 0) {
            const avg = getRating(id);
            setAverageRating(avg);
        }
    }, [ratings, id]);

    if (!hasLoaded) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <Alert variant="danger">{errorMessage}</Alert>; // Display an error message if there's an error
    }

    // Function to check if the current user is enrolled and return `is_owner`
    const isUserEnrolled = (profileId, courseId) => {
        const enrollment = enrollments.find(
            (enrollment) => enrollment.profile_id === profileId && enrollment.course === courseId
        );
        return enrollment ? enrollment.is_owner : false;  // Return `is_owner` if enrolled, otherwise false
    };

    return (
        <div>
            <Row className="m-2">
                <Col className="py-2 p-0 p-lg-2" lg={10}>
                    <Card>
                        <Link to={`/`}>
                            {/* Ensure you're accessing the correct properties from `course` */}
                            {course && course.thumbnailImage ? (
                                <Card.Img
                                    variant="top"
                                    src={course.thumbnailImage} // Access the thumbnailImage
                                    className={`${styles.CourseImage}`}
                                    alt={course.course_title} // Access the course title for alt text
                                />
                            ) : (
                                <div>No Image Available</div>
                            )}
                        </Link>
                        <Card.Body>
                            {course ? (
                                <>
                                    <Accordion>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                                    <Card.Title>
                                                        <Card.Title>{course.course_title}</Card.Title>
                                                    </Card.Title>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>{course && <Card.Text>
                                                    <ReactQuill
                                                        value={course.about}
                                                        readOnly
                                                        theme="snow"
                                                        modules={modules}
                                                    />
                                                </Card.Text>}</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>

                                    <Card.Text>
                                        <p><strong>Duration:</strong> {course.duration}</p>
                                        <p><strong>Ratings:</strong> {course.ratings_count}</p>
                                        <p><strong>Rate:</strong> {averageRating}</p>
                                        <p><strong>Reviews:</strong> {course.reviews_count}</p>
                                        <p><strong>Enrollments:</strong> {course.enrollments_count}</p>
                                    </Card.Text>
                                </>
                            ) : (
                                <div>No course data available.</div>
                            )}
                        </Card.Body>
                        <Card.Footer className='m-2 text-center'>
                            {isUserEnrolled(currentUser.profile_id, course.id) ? (
                                <>
                                    <Button className='mx-2' variant="info" onClick={() => { }}>
                                        Rate
                                    </Button>
                                    <Button className='mx-2' variant="info" onClick={() => { }}>
                                        Review
                                    </Button>
                                </>
                            ) : (
                                <Button variant="primary" onClick={() => { }}>Enroll</Button>
                            )}
                            {errorMessage && (
                                <Alert variant="warning" onClose={() => setErrorMessage('')} dismissible>
                                    {errorMessage}
                                </Alert>
                            )}
                        </Card.Footer>
                    </Card>
                    <Container className={appStyles.Content}>
                        {currentUser ? (
                            <ReviewCreateForm
                                profile_id={currentUser.profile_id}
                                profileImage={currentUser.profile_image}
                                course={course.id}
                                setPost={setPost}
                                setReviews={setReviews}

                            />
                        ) : reviews.results.length ? (
                            "Comments"
                        ) : null}
                        {reviews.results.length ? (
                            <InfiniteScroll
                                children={reviews.results.map((review) => (
                                    <Review
                                        key={review.id}
                                        {...review}
                                        setPost={setPost}
                                        setReviews={setReviews}
                                    />
                                ))}
                                dataLength={reviews.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!reviews.next}
                                next={() => fetchMoreData(reviews, setReviews)}
                            />
                        ) : currentUser ? (
                            <span>No reviews yet, be the first to write a review!</span>
                        ) : (
                            <span>No reviews... yet</span>
                        )}
                    </Container>
                </Col>
            </Row>
        </div>
    );
};

export default CoursePage;
