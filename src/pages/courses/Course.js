import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert';
import styles from "../../styles/Course.module.css"
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from '../../api/axiosDefaults';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const Courses = ({ message, filter = "" }) => {

  const [courses, setCourses] = useState({ results: [] });
  const [enrollments, setEnrollments] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();
  const history = useHistory();

  // Function to reload the page
  const reloadPage = () => {
    history.push('/courses'); // Navigate to the root (or any route)
    history.go(0); // Reload the page
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosReq.get(`/courses/?${filter}search=${query}`);
        setCourses(data);
        // Fetch Enrollments
        const { data: enrollmentData } = await axiosReq.get('/enrollments/');
        setEnrollments(enrollmentData.results);

        setHasLoaded(true);
      } catch (err) {
        console.log(err);
        setErrorMessage(err.response?.data.detail);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchCourses();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  // Function to check if the current user is enrolled and return `is_owner`
  const getEnrollmentOwnershipStatus = (profileId, courseId) => {
    const enrollment = enrollments.find(
      (enrollment) => enrollment.profile_id === profileId && enrollment.course === courseId
    );
    return enrollment ? enrollment.is_owner : false;  // Return `is_owner` if enrolled, otherwise false
  };

  const getEnrollmentId = (profileId, courseId) => {
    const enrollment = enrollments.find(
      (enrollment) => enrollment.profile_id === profileId && enrollment.course === courseId
    );
    console.log("Course ", courseId, " Profile ID ", profileId, " ID : ",)
    return enrollment ? enrollment.id : null;
  };

  // enroll
  const handleEnrollment = async (courseId) => {
    try {
      const { data } = await axiosReq.post('/enrollments/', { course: courseId });
      setCourses((prevCourses) => ({
        ...prevCourses,
        results: prevCourses.results.map((course) =>
          course.id === courseId
            ? {
              ...course,
              enrollments_count: course.enrollments_count + 1,
              enrollment_id: data.id,
            }
            : course
        ),
      }));
      reloadPage();
      setErrorMessage('');
    } catch (err) {
      //console.log("Enrolling in Course error", err.response?.data.detail);
      setErrorMessage(err.response?.data.detail);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

    }
  };

  // Unenrollment
  const handleUnenrollment = async (courseId, enrollmentId) => {
    try {
      // Send a DELETE request to remove the enrollment
      await axiosReq.delete(`/enrollments/${enrollmentId}/`);

      // Update the courses state
      setCourses((prevCourses) => ({
        ...prevCourses,
        results: prevCourses.results.map((course) =>
          course.id === courseId
            ? {
              ...course,
              enrollments_count: course.enrollments_count - 1, // Decrease enrollments count
              enrollment_id: null, // Reset enrollment_id to null after unenrollment
            }
            : course
        ),
      }));
      reloadPage();
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.response?.data.detail);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };


  return (
    <Container>
      <Row className='m-2'>
        <CardDeck className='justify-content-center'>
          {courses.results.map((course) => (
            <Col className="py-2 p-0 p-lg-2" lg={5}>
              <Card>
                <Link to={`/courses/${course.id}`}>
                <Card.Img variant="top" src={course.thumbnailImage} className={`${styles.CourseImage}`} alt={course.course_title} />
                </Link>
                
                <Card.Body>
                  <Card.Title className='text-center'> <strong>{course.course_title}</strong></Card.Title>
                  <Card.Text>
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Ratings:</strong> {course.ratings_count}</p>
                    <p><strong>Reviews:</strong> {course.reviews_count}</p>
                    <p><strong>Enrollments:</strong> {course.enrollments_count}</p>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>

                  {getEnrollmentOwnershipStatus(currentUser.profile_id, course.id) ? (
                    <Button variant="danger" onClick={() => handleUnenrollment(course.id, getEnrollmentId(currentUser.profile_id, course.id))}>
                      Unenroll
                    </Button>
                  ) : (
                    <Button className='m-2 text-center' variant="primary" onClick={() => handleEnrollment(course.id)}>Enroll</Button>
                  )}
                  {errorMessage && (
                    <Alert variant="warning" onClose={() => setErrorMessage('')} dismissible>
                      {errorMessage}
                    </Alert>
                  )}

                </Card.Footer>
              </Card>
            </Col>

          ))}
        </CardDeck>
      </Row>
    </Container>
  );
};

export default Courses;
