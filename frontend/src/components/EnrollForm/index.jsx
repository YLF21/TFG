import React, { Component } from 'react'
import { Button, ListGroup, Row, Col, Form, Container } from 'react-bootstrap'
import axios from 'axios'
import Student from '../Student'
import Notification from '../Notification'
import './index.css'

export default class StudentsList extends Component {
  state = {
    students: [],
    selectedStudent: null,
    searchQuery: '',
    notification: {
      show: false,
      message: '',
      color: '',
      router: '',
      autoDismiss: false,
    },
  };

  componentDidMount() {
    this.fetchStudents()
  }

  fetchStudents = () => {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3001/student', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        this.setState({ students: response.data.data })
      })
      .catch(error => {
        console.error('Error fetching students:', error)
      })
  }

  handleSelectStudent = (student) => {
    this.setState({ selectedStudent: student })
  }

  handleSendStudent = () => {
    const { selectedStudent } = this.state
    const token = localStorage.getItem('token')

    axios.post('http://localhost:3001/studentSubject', {
      student: selectedStudent,
      subject: this.props.subject
    },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {

        const data = response.data;

        const newNotification = {
          show: true,
          message: data.msg,
          color: data.code === '0000' ? 'success' : 'error',
          router: data.code === '0000' ? '' : '',
          autoDismiss: data.code === '0000'
        }

        this.setState({ notification: newNotification })

        if (data.code === '0000') {
          window.location.reload();
        }

      })
      .catch(error => {
        console.error('Error sending student:', error);
      });
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  }

  render() {
    const { students, selectedStudent, searchQuery, notification } = this.state;
    const filteredStudents = students.filter(student =>
      student.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router} />}
        <Container style={{ maxWidth: '400px' }}>
          <Row className="justify-content-center">
            <Col>
              <h3>Student List</h3>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Buscar alumno"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                />
              </Form.Group>
              <div className="list-container">
                <ListGroup>
                  {filteredStudents.map(student => (
                    <ListGroup.Item
                      key={student._id}
                      action
                      className={student._id === selectedStudent?._id ? 'selected-student' : ''}
                      onClick={() => this.handleSelectStudent(student)}
                    >
                      <Row>
                        <Col sm={12}>
                          <div className="student-info text-center flex-grow-1">
                            <Student {...student} />
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <div className="mt-3 d-flex justify-content-center">
                <Button variant="success" onClick={this.handleSendStudent} disabled={!selectedStudent}>
                  Enroll
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}
