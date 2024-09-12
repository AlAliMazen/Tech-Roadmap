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
    setCourse,
    category_title,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment_id, setEnrollementId] = useState(0);


  const modules = {
    toolbar: false
  };
  // Fetch ratings for the course and the enrollment of the current user
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data: ratingData } = await axiosRes.get(`/ratings/?course=${id}`);
        setRatings(ratingData.results);
        const { data: enrollmentData } = await axiosRes.get(`/enrollments/?course=${id}`);
        setEnrollments(enrollmentData.results);
      } catch (err) {
        console.log(err);
        setErrorMessage(err.response?.data?.detail);
      }
    };

    handleMount();
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

  const isUserEnrolled = (courseId) => {
    const courseEnrollments = enrollments.filter(enrollment => enrollment.course === courseId);
    if (courseEnrollments.length > 0 && currentUser) {
      if (currentUser) {
        const enrollment = courseEnrollments.find(enrollment => enrollment.profile_id === currentUser.profile_id);
        const { is_owner } = enrollment;
        const { id } = enrollment;
        setEnrollementId(id)
        return is_owner;
      }
    } 
    return false;
  };


  // Set the average rating when ratings are fetched
  useEffect(() => {
    if (ratings.length > 0) {
      const avg = getRating(id);
      setAverageRating(avg);
    }
    if (enrollments.length > 0) {
      const enrolled = isUserEnrolled(id)
      setIsEnrolled(enrolled)
      console.log("is current user enrolled : ", enrolled);
    }
  }, [id, ratings, enrollments]);

  const handleEdit = () => {
    history.push(`/courses/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/courses/${id}/`);
      history.goBack();
    } catch (err) {
      setErrorMessage(err.response?.data?.detail);
    }
  };

  const handleEnroll = async () => {
    try {
      const { data } = await axiosRes.post("/enrollments/", { course: id });
      setCourse((prevCourses) => ({
        ...prevCourses,
        results: prevCourses.results.map((course) => {
          return course.id === id
            ? { ...course, enrollments_count: course.enrollments_count + 1, enrollment_id: data.id }
            : course;
        }),
      }));
      setEnrollementId(enrollment_id)
      setIsEnrolled(true)
      setErrorMessage('');
      setSuccessMessage("Enrolled successfully!");
      setTimeout(() => setSuccessMessage(''), 3000);
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.response?.data?.detail);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleUnenroll = async () => {
    console.log("From the handle Unenrolment : ", enrollment_id)
    try {
      await axiosRes.delete(`/enrollments/${enrollment_id}/`);
      setCourse((prevCourses) => ({
        ...prevCourses,
        results: prevCourses.results.map((course) => {
          return course.id === id
            ? { ...course, enrollments_count: course.enrollments_count - 1, enrollment_id: null }
            : course;
        }),
      }));
      setErrorMessage('');
      setIsEnrolled(false)
      setSuccessMessage("Unenrolled successfully!");
      setTimeout(() => setSuccessMessage(''), 3000);
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.response?.data?.detail);
      setTimeout(() => setErrorMessage(''), 3000);
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
              <Card.Body>
                <ReactQuill
                  value={about}
                  readOnly
                  theme="snow"
                  modules={modules}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <div className={styles.CourseBar}>
          <div>
            {isEnrolled ? (
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
        {successMessage && <Alert variant="sucess">{successMessage}</Alert>}
      </Card.Body>
    </Card>
  );
};

export default Course;
