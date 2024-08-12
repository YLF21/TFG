import React, { Component } from 'react'
import UserLogout from '../../components/UserLogout'

export default class UserHeader extends Component {
  render() {

    const { onLogout } = this.props;

    return (
      <UserLogout onLogout={onLogout} />      
    )
  }
}
