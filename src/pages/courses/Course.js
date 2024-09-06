import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router";
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
    <div className={`${styles.CourseContainer}`}>
      {courses.results.map((course) => (
        <div key={course.id} className={`${styles.CourseCard}`}>
          <img src={course.thumbnailImage} alt={course.course_title} className={`${styles.CourseImage}`}/>
          <h2>{course.course_title}</h2>
          <p><strong>Duration:</strong> {course.duration}</p>
          <p>{course.about}</p>
        </div>
      ))}
    </div>
  );
};

export default Courses;
