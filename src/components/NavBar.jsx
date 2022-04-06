import React, { useState } from 'react';
import "./NavBar.css"
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav,Form, FormControl, Button } from "react-bootstrap";
import { RiMovie2Line } from 'react-icons/ri';
import { Container } from '@mui/material';


const NavBar = () => {
  const [term, setTerm] = useState("")
  let navigate = useNavigate();
  const logout = () =>{
    fetch('/logout')
    window.location = '/';
  }
  const Submit = (e)  => {
    e.preventDefault();
    window.location = `/search/${term}`;
}
const handleSelect = (eventKey) => {
  console.log(eventKey)
  navigate(eventKey);
}
  return (
    <>
    <Navbar bg="light" expand="lg">
    <Container fluid>
      <Navbar.Brand href="/search">
        <RiMovie2Line width="30" height="30" className='d-inline-block align-top'
        />{' '}
        Movie View
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
      <Nav variant="pills" defaultActiveKey="/home"  onSelect={handleSelect} className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '100px' }}
        navbarScroll>
          <Nav.Item>
            <Nav.Link eventKey="/search">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="" href="https://github.com/Afinch97/Movie-Viewer" target="_blank" rel="noreferrer">About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/favs">Favorites</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/myComments">Comments</Nav.Link>
          </Nav.Item>
        </Nav>
        <Form className="d-flex" onSubmit={Submit}>
        <FormControl
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          onChange={e =>setTerm(e.target.value)} 
          value={term}
        />
        <Button variant="outline-success" type="submit">Search</Button>
      </Form>
      <Button variant="danger" onClick={logout}>Logout</Button>
      </Navbar.Collapse>
    </Container>
    </Navbar>
    </>
  )
}

export default NavBar