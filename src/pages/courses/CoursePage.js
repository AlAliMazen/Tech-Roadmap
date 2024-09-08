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
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Accordion } from "react-bootstrap";

const CoursePage = () => {
    const { id } = useParams(); // Gets the id from the route
    const [course, setCourse] = useState(null); // Initialize as null
    const [enrollments, setEnrollments] = useState([]); // Initialized as an empty array
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
                const { data } = await axiosReq.get(`/courses/${id}`);
                console.log("API Response (course):", data); // Debugging API response
                setCourse(data);
                setHasLoaded(true); // Mark as loaded

                // Fetch enrollments
                const { data: enrollmentData } = await axiosReq.get('/enrollments/');
                setEnrollments(enrollmentData.results); // Set the enrollments
            } catch (err) {
                console.error("Error fetching course data:", err); // Better error logging
                setErrorMessage(err.response?.data?.detail || 'Something went wrong'); // Fallback error message
            }
        };

        handleMount(); // Call the function on mount
    }, [id]);

    if (!hasLoaded) {
        return <div>Loading...</div>; // Render a loading indicator while data is being fetched
    }

    if (errorMessage) {
        return <Alert variant="danger">{errorMessage}</Alert>; // Display an error message if there's an error
    }

    // Function to check if the current user is enrolled and return `is_owner`
    const getEnrollmentOwnershipStatus = (profileId, courseId) => {
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
                                        <p><strong>Reviews:</strong> {course.reviews_count}</p>
                                        <p><strong>Enrollments:</strong> {course.enrollments_count}</p>
                                    </Card.Text>
                                </>
                            ) : (
                                <div>No course data available.</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CoursePage;
