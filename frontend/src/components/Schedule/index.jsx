import React, { Component } from 'react'
import { FaTimes } from 'react-icons/fa'
import ConfirmModal from '../ConfirmModal'

export default class index extends Component {
  state = {
    hover: false,
    showModal: false,
  };

  handleMouseEnter = () => {
    this.setState({ hover: true })
  };

  handleMouseLeave = () => {
    this.setState({ hover: false })
  };

  handleShowModal = () => {
    this.setState({ showModal: true })
  };

  handleCloseModal = () => {
    this.setState({ showModal: false })
  };

  handleConfirmDelete = () => {
    const { _id, onDelete } = this.props
    onDelete(_id);
    this.handleCloseModal();
  };

  render() {
    const { startTime, endTime, classroom } = this.props
    const { hover, showModal } = this.state

    const startDate = new Date(startTime)
    const endDate = new Date(endTime)

    const localStartDate = new Date(startDate.getTime() + startDate.getTimezoneOffset() * 60000)
    const localEndDate = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000)

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    const formattedStartTime = localStartDate.toLocaleString('en-GB', options).replace(',', '')
    const formattedEndTime = localEndDate.toLocaleString('en-GB', options).replace(',', '')

    return (
      <div
        className="card"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{ position: 'relative', textAlign: 'center' }}
      >
        <div className="card-body">
          <div>
            <span>{formattedStartTime}</span> - <span>{formattedEndTime}</span>
            <p className="card-text">Classroom: {classroom.classroomName}</p>
          </div>
          {hover && (
            <FaTimes
              className="text-danger"
              style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}
              onClick={this.handleShowModal}
            />
          )}
          <ConfirmModal
            show={showModal}
            handleClose={this.handleCloseModal}
            handleConfirm={this.handleConfirmDelete}
          />
        </div>
      </div>
    );
  }
}
