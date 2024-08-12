import React, { Component } from 'react'
import './index.css'

export default class Student extends Component {
  render() {
    const { username, email } = this.props
    return (
      <div className="student-card">
        <p>{username}</p>
        <small>Email: {email}</small>
      </div>
    );
  }
}

