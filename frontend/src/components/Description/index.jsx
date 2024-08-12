import React, { Component } from 'react'

export default class index extends Component {
  render() {
    const {description} = this.props.subject
    return (
      <div>{description}</div>
    )
  }
}
