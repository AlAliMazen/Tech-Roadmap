import React from "react";
// import the component

import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo/Tech_roadmap_BB.png";

//importing the styles of the Navbar
import styles from "../styles/NavBar.module.css";

//import the NavLink from root directory
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand href="#home">
            <img src={logo} alt="tech-road-map-logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fa-solid fa-house-chimney mr-2"></i>Home
            </NavLink>
            <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/courses"
            >
              <i className="fa-solid fa-book mr-2"></i> Courses
            </NavLink>
            <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/articles"
            >
              <i className="fa-solid fa-newspaper mr-2"></i> Articles
            </NavLink>
            <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/categories"
            >
              {" "}
              <i className="fa-solid fa-table-list mr-2"></i>Categories
            </NavLink>
            <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/signin"
            >
              {" "}
              <i className="fas fa-sign-in mr-2"></i>Sign in
            </NavLink>
            <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/signup"
            >
              <i className="fa-solid fa-user-plus mr-2"></i>Sign up
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
