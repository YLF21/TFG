import React, { Component } from 'react'
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default class index extends Component {

  render() {

    const {setShowLeftDropdown} = this.props

    return (
      <>
        <Nav.Link as={NavLink} to='/classroom' onClick={() => setShowLeftDropdown(false)}>Classroom</Nav.Link>
      </>
    );
  }
}
