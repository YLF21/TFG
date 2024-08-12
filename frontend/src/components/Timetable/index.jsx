import React, { Component } from 'react'
import axios from 'axios'
import { Button, Modal, Form, Col, Row } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Notification from '../Notification'
import TimetableForm from '../TimetableForm'
import Time from '../Time'
import ConfirmModal from '../ConfirmModal'
import './index.css'

export default class index extends Component {
  state = {
    times: [],
    showEditModal: false,
    showDeleteModal: false,
    currentTimetable: null,
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    selectedClassroom: null,
    classroomOptions: [],
    notification: {
      show: false,
      message: '',
      color: '',
      router: '',
      autoDismiss: false,
    },
  }

  async componentDidMount() {

    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`/timetable/subject/${this.props.subject._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const classroomResponse = await axios.get('http://localhost:3001/classroom', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      this.setState({
        times: response.data.data,
        classroomOptions: classroomResponse.data.data,
      })

    } catch (error) {
      console.error('Error fetching subject info:', error)
    }
  }

  handleEditClick = (timetable) => {
    const parsedStartTime = new Date(timetable.startTime)
    const Starthours = parsedStartTime.getUTCHours().toString().padStart(2, '0')
    const Startminutes = parsedStartTime.getUTCMinutes().toString().padStart(2, '0')
    const parsedEndTime = new Date(timetable.endTime)
    const Endhours = parsedEndTime.getUTCHours().toString().padStart(2, '0')
    const Endminutes = parsedEndTime.getUTCMinutes().toString().padStart(2, '0')
    this.setState({
      showEditModal: true,
      currentTimetable: timetable,
      dayOfWeek: timetable.dayOfWeek,
      startTime: `${Starthours}:${Startminutes}`,
      endTime: `${Endhours}:${Endminutes}`,
      selectedClassroom: timetable.classroom,
    })
  }

  handleDeleteClick = (timetable) => {
    this.setState({ showDeleteModal: true, currentTimetable: timetable })
  }

  handleCloseModal = () => {
    this.setState({ showEditModal: false, showDeleteModal: false })
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleClassroomChange = (e) => {
    const selectedClassroom = this.state.classroomOptions.find(
      (classroom) => classroom._id === e.target.value
    )
    this.setState({ selectedClassroom })
  }

  handleSaveChanges = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const { currentTimetable, dayOfWeek, startTime, endTime, selectedClassroom } = this.state

    const startHour = startTime.split(':')[0]
    const startMinute = startTime.split(':')[1]
    const endHour = endTime.split(':')[0]
    const endMinute = endTime.split(':')[1]

    try {
      const response = await axios.put(
        `/timetable/${currentTimetable._id}`,
        {
          dayOfWeek,
          startHour,
          startMinute,
          endHour,
          endMinute,
          classroom: selectedClassroom._id,
          subject: this.props.subject._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '' : '',
        autoDismiss: data.code === '0000',
      }

      this.setState((prevState) => ({
        times: prevState.times.map((time) =>
          time._id === currentTimetable._id
            ? { ...time, dayOfWeek, startHour, startMinute, endHour, endMinute, classroom: selectedClassroom }
            : time
        ),
        showEditModal: false,
        notification: newNotification,
      }))

      if (data.code === '0000') {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating timetable:', error)
    }
  };

  handleDeleteTimetable = async () => {
    const token = localStorage.getItem('token')
    const { currentTimetable } = this.state

    try {
      const response = await axios.delete(`/timetable/${currentTimetable._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response.data

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '' : '',
        autoDismiss: data.code === '0000',
      };

      this.setState((prevState) => ({
        times: prevState.times.filter((time) => time._id !== currentTimetable._id),
        showDeleteModal: false,
        notification: newNotification,
      }));

      if (data.code === '0000') {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting timetable:', error)
    }
  }

  render() {
    const { times, showEditModal, showDeleteModal, dayOfWeek, startTime, endTime, selectedClassroom, classroomOptions, notification } = this.state

    return (
      <div>
        <h2>Timetable</h2>
        <div>
          {notification.show && (
            <Notification
              message={notification.message}
              color={notification.color}
              autoDismiss={notification.autoDismiss}
              router={notification.router}
            />
          )}
          <div className='times-container'>
            {times.map((time) => (
              <div key={time._id} className='time-entry position-relative'>
                <Row className='align-items-center border p-2'>
                  <Col xs={11} className='border-end'>
                    <Time {...time} />
                  </Col>
                  <Col xs={1} className='text-right'>
                    <Button variant='link' onClick={() => this.handleEditClick(time)}>
                      <FaEdit />
                    </Button>
                    <Button variant='link' onClick={() => this.handleDeleteClick(time)}>
                      <FaTrash className='trash-icon' />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
          <TimetableForm subject={this.props.subject} />
        </div>

        <Modal show={showEditModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Timetable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSaveChanges}>
              <Row className="mb-3 align-items-center">
                <Col>
                  <Form.Label>Day of Week:</Form.Label>
                  <Form.Control type="number" name='dayOfWeek' value={dayOfWeek} onChange={this.handleInputChange} min={1} max={7} required />
                </Col>
                <Col>
                  <Form.Label>Start Time:</Form.Label>
                  <Form.Control type="time" name='startTime' value={startTime} onChange={this.handleInputChange} required />
                </Col>
                <Col>
                  <Form.Label>End Time:</Form.Label>
                  <Form.Control type="time" name='endTime' value={endTime} onChange={this.handleInputChange} required />
                </Col>
                <Col>
                  <Form.Label>Classroom:</Form.Label>
                  <Form.Select value={selectedClassroom ? selectedClassroom._id : ''} onChange={this.handleClassroomChange} required>
                    <option value="">Select a Classroom</option>
                    {classroomOptions.map(classroom => (
                      <option key={classroom._id} value={classroom._id}>{classroom.classroomName}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Button variant="primary" type="submit">Save changes</Button>
            </Form>
          </Modal.Body>
        </Modal>

        <ConfirmModal
          show={showDeleteModal}
          handleClose={this.handleCloseModal}
          handleConfirm={this.handleDeleteTimetable}
        />
      </div>
    )
  }
}
