import React, { Component } from 'react'
import { Nav} from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import './index.css'

export default class index extends Component {
  render() {
    const {setShowLeftDropdown} = this.props
    return (
          <>
            <Nav.Link as={NavLink} to='/mySubject' onClick={() => setShowLeftDropdown(false)}>My Subject</Nav.Link>
          </>
    )
  }
}
