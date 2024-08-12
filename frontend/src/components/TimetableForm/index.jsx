import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Col, Row } from 'react-bootstrap';
import Notification from '../Notification';
import './index.css';

export default class TimetableForm extends Component {
  state = {
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    classroomOptions: [],
    selectedClassroom: null,
    notification: {
      show: false,
      message: '',
      color: '',
      router:'',
      autoDismiss: false
    },
    showForm: false 
  };

  async componentDidMount() {
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get('http://localhost:3001/classroom', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      this.setState({ classroomOptions : response.data.data })
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleClassroomChange = (e) => {
    const selectedClassroom = this.state.classroomOptions.find(classroom => classroom._id === e.target.value);
    this.setState({
      selectedClassroom
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    const { dayOfWeek, startTime, endTime, selectedClassroom } = this.state;
    
    const startHour = startTime.split(':')[0];
    const startMinute = startTime.split(':')[1];
    const endHour = endTime.split(':')[0];
    const endMinute = endTime.split(':')[1];

    try {
      this.setState({ loading: true });
      const response = await axios.post('http://localhost:3001/timetable', {
        dayOfWeek,
        startHour,
        startMinute,
        endHour,
        endMinute,
        subject: this.props.subject,
        classroom: selectedClassroom 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '' : '',
        autoDismiss: data.code === '0000'
      };

      this.setState({ notification: newNotification });
      
      if (response.data.code === '0000') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error submitting timetable:', error)
    }
  };

  toggleForm = () => {
    const {notification} = this.state;
    this.setState(prevState => ({
      showForm: !prevState.showForm
    }));
    if(notification.show){
      this.setState({ notification: { ...this.state.notification, show: false } });
    }
  };

  render() {
    const { dayOfWeek, startTime, endTime, classroomOptions, selectedClassroom, notification, showForm } = this.state;

    return (
      <>
        {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
        <div className="timetableForm shadow p-3 rounded">
          <Form onSubmit={this.handleSubmit} style={{ display: showForm ? 'block' : 'none' }}>
            <Row className="mb-3 align-items-center">
              <Col>
                <Form.Label>Day of Week:</Form.Label>
                <Form.Control type="number" name='dayOfWeek' value={dayOfWeek} onChange={this.handleChange} min={1} max={7} required />
              </Col>
              <Col>
                <Form.Label>Start Time:</Form.Label>
                <Form.Control type="time" name='startTime' value={startTime} onChange={this.handleChange} required />
              </Col>
              <Col>
                <Form.Label>End Time:</Form.Label>
                <Form.Control type="time" name='endTime' value={endTime} onChange={this.handleChange} required />
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
            <Row>
              <Col>
                <Button variant="primary" type="submit">Add</Button>
              </Col>
              <Col>
                {showForm && <Button variant="danger" onClick={this.toggleForm}>Cancel</Button>}
              </Col>
            </Row>
          </Form>
          {!showForm && <Button variant="primary" onClick={this.toggleForm}>Add New</Button>}
        </div>
      </>
    )
  }
}
