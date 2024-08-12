import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Offcanvas} from 'react-bootstrap'
import axios from 'axios'
import HeaderProfessor from '../HeaderProfessor'
import HeaderStudent from '../HeaderStudent'
import HeaderAdmin from '../HeaderAdmin'
import logo from '../../img/logo.png'
import menu from '../../img/menu.png'
import './index.css'

export default function Logout(props) {

  const navigate = useNavigate();

  const [showLeftDropdown, setShowLeftDropdown] = useState(false)
  const [showRightDropdown, setShowRightDropdown] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:3001/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data

      if (data.code === '0000') {
        props.onLogout()
        navigate('/')
      } 

    } catch (error) {
      console.error('Request error:', error)
    }
  };

  const rol = localStorage.getItem("rol")
  const username = localStorage.getItem("username")

  return (
    <>    
      <Navbar bg="dark" variant="dark" expand="lg" className="px-0">
        <Navbar.Toggle aria-controls="navbarNavDropdown" />
        <Navbar.Collapse id="navbarNavDropdown">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setShowLeftDropdown(true)}>
              <img src={menu} alt="Logo" className="logo" />
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={`Welcome "${username}" !`} id="nav-dropdown-right" className="menu-right" show={showRightDropdown} onToggle={() => setShowRightDropdown(!showRightDropdown)} align="end">
              <NavDropdown.Item as={NavLink} to={`/profile/${username}`}>Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={onSubmit}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand as={NavLink} to="/" className="me-auto"><img src={logo} alt="Logo" className="logo" /></Navbar.Brand>
      </Navbar>
      <Offcanvas show={showLeftDropdown} onHide={() => setShowLeftDropdown(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/" onClick={() => setShowLeftDropdown(false)}>Home</Nav.Link>
            {rol === 'professor' && <HeaderProfessor setShowLeftDropdown={setShowLeftDropdown} />}
            {rol === 'student' && <HeaderStudent setShowLeftDropdown={setShowLeftDropdown} />}
            {rol === 'admin' && <HeaderAdmin setShowLeftDropdown={setShowLeftDropdown} />}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
