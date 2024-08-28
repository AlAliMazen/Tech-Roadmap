import React from 'react'
// import the component
import {Navbar, Container, Nav} from "react-bootstrap"
import logo from "../assets/logo/Tech_roadmap_BB.png"

const NavBar = () => {
  return (
    <Navbar expand="md" bg="light" fixed='top'> <Container>
    <Navbar.Brand href="#home">
        <img src={logo} alt='tech-road-map-logo' height='45'/>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto text-left">
            <Nav.Link><i className='fa-solid fa-house-chimney mr-2'></i>Home</Nav.Link>
            <Nav.Link><i className='fa-solid fa-book mr-2'></i> Courses</Nav.Link>
            <Nav.Link><i className='fa-solid fa-newspaper mr-2'></i> Articles</Nav.Link>
            <Nav.Link> <i className='fa-solid fa-table-list mr-2'></i>Categories</Nav.Link>
            <Nav.Link> <i className='fas fa-sign-in mr-2'></i>Sign in</Nav.Link>
            <Nav.Link><i className='fa-solid fa-user-plus mr-2'></i>Sign up</Nav.Link>
        </Nav>
    </Navbar.Collapse></Container>
    </Navbar>
  )
}

export default NavBar
