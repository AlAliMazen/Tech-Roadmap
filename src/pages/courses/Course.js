import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import styles from "../../styles/Course.module.css"
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from '../../api/axiosDefaults';


const Courses = ({ message, filter = "" }) => {
  const [courses, setCourses] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosReq.get(`/courses/?${filter}search=${query}`);
        setCourses(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
        setError(err)
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

  return (
    <Container>
      <Row className='m-2'>
        <CardDeck className='justify-content-center'>
          {courses.results.map((course) => (
            <Col className="py-2 p-0 p-lg-2" lg={5}>
              <Card>
                <Card.Img variant="top" src={course.thumbnailImage} className={`${styles.CourseImage}`} alt={course.course_title} />
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
                  <Button variant="primary">Enroll</Button>
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
