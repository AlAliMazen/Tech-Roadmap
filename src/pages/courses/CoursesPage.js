import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Course from "./Course";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/CoursesPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Alert from "react-bootstrap/Alert";


function CoursesPage({ message, filter = "" }) {
  const [courses, setCourses] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosReq.get(`/courses/?${filter}search=${query}`);
        setCourses(data);
        setHasLoaded(true);
      } catch (err) {
        //console.log(err);
        setErrorMessage(err.response?.data?.detail || 'Something went wrong');
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
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search courses"
          />
        </Form>

        {hasLoaded ? (
          <>
            {courses.results.length ? (
              <InfiniteScroll
                children={courses.results.map((course) => (
                  <Course key={course.id} {...course} setCourse={setCourses} />
                ))}
                dataLength={courses.results.length}
                loader={<Asset spinner />}
                hasMore={!!courses.next}
                next={() => fetchMoreData(courses, setCourses)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles /> 
      </Col>
    </Row>
  );
}

export default CoursesPage;
