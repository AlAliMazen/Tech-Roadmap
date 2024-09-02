import React from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";

function CoursesPage() {
  // Add your logic here


  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Course Title</p>
        <p>About Course</p>
        <Container className={appStyles.Content}>
          Comments on Course
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Image of the Course thumbnail
      </Col>
    </Row>
  );
}

export default CoursesPage;