import React, { Component } from 'react'
import { ListGroup, Row, Col, Form, Container } from 'react-bootstrap'
import axios from 'axios'
import { FaTrash } from 'react-icons/fa'
import Student from '../Student'
import ConfirmModal from '../ConfirmModal'
import Notification from '../Notification'
import './index.css'

export default class index extends Component {
  state = {
    students: [],
    searchQuery: '',
    hoveredStudentId: null,
    showModal: false,
    studentToDelete: null,
    studentSubjectToDelete: null,
    notification: {
      show: false,
      message: '',
      color: '',
      router:'',
      autoDismiss: false
    },
  };

  componentDidMount() {
    this.fetchStudents()
  }

  fetchStudents = () => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3001/student/subject/${this.props.subject._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        this.setState({ students: response.data.data })
      })
      .catch(error => {
        console.error('Error fetching students:', error)
      });
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value })
  }

  handleMouseEnter = (studentId) => {
    this.setState({ hoveredStudentId: studentId })
  }

  handleMouseLeave = () => {
    this.setState({ hoveredStudentId: null })
  }

  handleShowModal = (studentId, studentSubjectId) => {
    this.setState({
      showModal: true,
      studentToDelete: studentId,
      studentSubjectToDelete: studentSubjectId,
    });
  }

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      studentToDelete: null,
      studentSubjectToDelete: null,
    });
  }

  handleConfirmDelete = async () => {
    const { studentToDelete, studentSubjectToDelete } = this.state
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`http://localhost:3001/studentSubject/${studentSubjectToDelete}`, {
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
      }

      this.setState(prevState => ({
        students: prevState.students.filter(student => student._id !== studentToDelete),
        showModal: false,
        studentToDelete: null,
        studentSubjectToDelete: null,
        notification: newNotification,
      }));

      if(data.code==='0000'){
        window.location.reload()
      }

    } catch (error) {
      console.error('Error unenrolling student:', error)
    }
  }

  render() {
    const { students, searchQuery, hoveredStudentId, showModal, notification } = this.state
    const filteredStudents = students.filter(student =>
      student.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Container style={{ maxWidth: '600px' }}>
        <Row className="justify-content-center">
          <Col>
            <h3 className="text-center">Enrolled Student List</h3>
            {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
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
                    className="d-flex justify-content-between align-items-center"
                    onMouseEnter={() => this.handleMouseEnter(student._id)}
                    onMouseLeave={this.handleMouseLeave}
                  >
                    <div className="student-info text-center flex-grow-1">
                      <Student {...student} />
                    </div>
                    {hoveredStudentId === student._id && (
                      <div
                        className="delete-icon"
                        onClick={() => this.handleShowModal(student._id, student.studentSubjectId)}
                      >
                        <FaTrash className="trash-icon" />
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
        <ConfirmModal
          show={showModal}
          handleClose={this.handleCloseModal}
          handleConfirm={this.handleConfirmDelete}
        />
      </Container>
    )
  }
}
