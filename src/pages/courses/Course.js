import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import Accordion from 'react-bootstrap/Accordion'

const Course = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    title,
    about,
    thumbnailImage,
    updated_at,
    created_at,
    course_title,
    reviews_count,
    ratings_count,
    enrollments_count,
    duration,
    category_title,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/courses/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/courses/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          
        </Media>
      </Card.Body>
      <Link to={`/courses/${id}`}>
        <Card.Img src={thumbnailImage} alt={title} />
      </Link>
      <Card.Body>
        
        <Accordion>
          <Card>
            <Card.Header>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              {course_title && <Card.Title className="text-center">{title} | {category_title}</Card.Title>}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>{about && <Card.Text>{about}</Card.Text>}</Card.Body>
            </Accordion.Collapse>
          </Card>
          
        </Accordion>
        
        <div className={styles.PostBar}>
        <Link to={`/courses/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {reviews_count}
          <Link to={`/courses/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {enrollments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Course;
