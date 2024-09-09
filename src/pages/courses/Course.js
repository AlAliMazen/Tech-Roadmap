import React, { useEffect, useState } from "react";
import styles from "../../styles/Course.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import ReactQuill from 'react-quill';
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import Accordion from 'react-bootstrap/Accordion';
import Alert from "react-bootstrap/Alert";

const Course = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    enrollments_count,
    reviews_count,
    ratings_count,
    title,
    course_title,
    about,
    thumbnailImage,
    updated_at,
    coursePage,
    setCourses,
    category_title,
    enrollment_id,  
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [ratings, setRatings] = useState([]);

  const modules = {
    toolbar: false
  };

  // Fetch ratings for the course
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await axiosRes.get(`/ratings/?course=${id}`);
        setRatings(data.results);
      } catch (err) {
        console.log(err);
        setErrorMessage("Failed to load ratings");
      }
    };

    fetchRatings();
  }, [id]);

  // Calculate the average rating
  const getRating = (courseId) => {
    const courseRatings = ratings.filter(rating => String(rating.course) === String(courseId));
    if (courseRatings.length > 0) {
      const totalRating = courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
      const average = totalRating / courseRatings.length;
      return average.toFixed(1);
    }
    return 0;
  };

  // Set the average rating when ratings are fetched
  useEffect(() => {
    if (ratings.length > 0) {
      const avg = getRating(id);
      setAverageRating(avg);
    }
  }, [ratings, id]);

  const handleEdit = () => {
    history.push(`/courses/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/courses/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response?.data?.detail || 'Something went wrong');
    }
  };

  const handleEnroll = async () => {
    try {
      const { data } = await axiosRes.post("/enrollments/", { course: id });
      setCourses((prevCourses) => ({
        ...prevCourses,
        results: prevCourses.results.map((course) => {
          return course.id === id
            ? { ...course, enrollments_count: course.enrollments_count + 1, enrollment_id: data.id }
            : course;
        }),
      }));
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response?.data?.detail || 'Something went wrong');
    }
  };

  const handleUnenroll = async () => {
    try {
      await axiosRes.delete(`/enrollments/${enrollment_id}/`);
      setCourses((prevCourses) => ({
        ...prevCourses,
        results: prevCourses.results.map((course) => {
          return course.id === id
            ? { ...course, enrollments_count: course.enrollments_count - 1, enrollment_id: null }
            : course;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={styles.Course}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && coursePage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/courses/${id}`}>
        <Card.Img src={thumbnailImage} alt={course_title} />
      </Link>
      <Card.Body>
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                {title && <Card.Title className="text-center">{course_title} | {category_title}</Card.Title>}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>{about && <Card.Text>
                <ReactQuill
                  value={about}
                  readOnly
                  theme="snow"
                  modules={modules}
                />
              </Card.Text>}</Card.Body>
            </Accordion.Collapse>
          </Card>

        </Accordion>

        <div className={styles.CourseBar}>
          <div>
            {enrollment_id ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Click to unenroll</Tooltip>}
              >
                <i className="fas fa-user-minus" onClick={handleUnenroll} />
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{is_owner ? "You can't enroll in your own course!" : "Click to enroll"}</Tooltip>}
              >
                <i className="fas fa-user-plus" onClick={handleEnroll} />
              </OverlayTrigger>
            )}
            {enrollments_count} enrollments
          </div>
          <div>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Rating of the course</Tooltip>}
            >
              <i className="fas fa-star" />
            </OverlayTrigger>
            <span>{averageRating}/10 ({ratings_count} ratings)</span>
          </div>
          
          <div>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Write a review if you are enrolled</Tooltip>}
            >
              <i className="fas fa-message" onClick={() => history.push(`/courses/${id}`)} />
            </OverlayTrigger>
            {reviews_count} reviews
          </div>
        </div>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </Card.Body>
    </Card>
  );
};

export default Course;
