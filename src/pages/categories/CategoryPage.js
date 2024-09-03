import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function CategoryPage() {
  // Add your logic here
  const { id } = useParams();
  const [category, setCategory] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: category }] = await Promise.all([
          axiosReq.get(`/categories/${id}`),
        ]);
        setCategory({ results: [category] });
        console.log(category);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);


  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Category Title</p>
        <p>Category content</p>
        <Container className={appStyles.Content}>
          {category.title}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        The category Content in second column
      </Col>
    </Row>
  );
}

export default CategoryPage;