import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { axiosReq } from '../../api/axiosDefaults';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Course.module.css";
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck'
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Accordion, Button } from "react-bootstrap";

const CoursePage = () => {
    const { id } = useParams(); // Gets the id from the route
    const [course, setCourse] = useState(null); // Initialize as null
    const [enrollments, setEnrollments] = useState([]); // Initialized as an empty array
    const [ratings, setRatings] = useState([]); // Store ratings
    const [averageRating, setAverageRating] = useState(null);

    const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
    const [hasLoaded, setHasLoaded] = useState(false); // Tracks loading status
    const currentUser = useCurrentUser(); // Current user information
    const modules = {
        toolbar: false
    }
    useEffect(() => {
        const handleMount = async () => {
            try {
                // Fetch course data using the id
                const { data: courseData } = await axiosReq.get(`/courses/${id}`);
                setCourse(courseData);

                // Fetch enrollments
                const { data: enrollmentData } = await axiosReq.get('/enrollments/');
                setEnrollments(enrollmentData.results); // Set the enrollments

                // Fetch ratings
                const { data: ratingsData } = await axiosReq.get(`/ratings/`);
                setRatings(ratingsData.results); // Set ratings

                setHasLoaded(true); // Mark as loaded
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
                                        <p><strong>Ratings:</strong> {getRating(id)}</p>
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
                </Col>
            </Row>
        </div>
    );
};

export default CoursePage;
