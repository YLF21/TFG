import React, { Component } from 'react'
import axios from 'axios'
import { Container, Row, Col, Spinner, Card, Button, Modal, Form } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa'
import EnrollForm from '../EnrollForm'
import EnrolledList from '../EnrolledList'
import Timetable from '../Timetable'
import Description from '../Description'

export default class SubjectDetail extends Component {
  state = {
    subjectInfo: null,
    loading: true,
    showEditModal: false,
    newDescription: ''
  };

  async componentDidMount() {
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`http://localhost:3001/subject/${this.props.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({ subjectInfo: response.data.data, loading: false })
    } catch (error) {
      console.error('Error fetching subject info:', error)
      this.setState({ loading: false });
    }
  }

  handleEditClick = () => {
    this.setState({ showEditModal: true, newDescription: this.state.subjectInfo.description })
  }

  handleCloseModal = () => {
    this.setState({ showEditModal: false })
  }

  handleDescriptionChange = (e) => {
    this.setState({ newDescription: e.target.value })
  }

  handleSaveDescription = async () => {
    const token = localStorage.getItem('token')
    const { newDescription, subjectInfo } = this.state

    try {
      await axios.patch(`http://localhost:3001/subject/${this.props.id}`, {
        description: newDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({
        subjectInfo: { ...subjectInfo, description: newDescription },
        showEditModal: false
      });
    } catch (error) {
      console.error('Error updating description:', error)
    }
  }

  render() {
    const { subjectInfo, loading, showEditModal, newDescription } = this.state

    if (loading) {
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      );
    }

    if (subjectInfo) {
      return (
        <div>
          <Container className="bg-white rounded p-4 mt-5 shadow-lg">
            <Row>
              <Col className="text-center">
                <h1>{subjectInfo.subjectName}</h1>
              </Col>
            </Row>
          </Container>
          <Container className="bg-white rounded p-4 mt-3 shadow-lg">
            <Row>
              <Col>
                <Button variant="link" className="text-right" onClick={this.handleEditClick}>
                  <FaEdit />
                </Button>
                <h3>Description</h3>
                <Card>
                  <Card.Body>
                    <Description subject={subjectInfo} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
          <Container className="bg-white rounded p-4 mt-3 shadow-lg">
            <Row>
              <Col>
                <Timetable subject={subjectInfo} />
              </Col>
            </Row>
          </Container>
          <Container className="bg-white rounded p-4 mt-3 shadow-lg">
            <Row>
              <Col>
                <EnrollForm subject={subjectInfo} />
              </Col>
            </Row>
          </Container>
          <Container className="bg-white rounded p-4 mt-3 shadow-lg">
            <Row>
              <Col>
                <EnrolledList subject={subjectInfo} />
              </Col>
            </Row>
          </Container>

          <Modal show={showEditModal} onHide={this.handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Description</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} value={newDescription} onChange={this.handleDescriptionChange} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleSaveDescription}>Save changes</Button>
              <Button variant="secondary" onClick={this.handleCloseModal}>Cancel</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else {
      return (
        <div className="mt-5 text-center">
          <p>No se pudo obtener la información del sujeto.</p>
        </div>
      )
    }
  }
}
