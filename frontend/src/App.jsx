import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import Header from './components/Header'
import UserHeader from './pages/UserHeader/UserHeader'
import ClassroomPage from './pages/ClassroomPage/ClassroomPage'
import CreateClass from './pages/CreateClass/CreateClass'
import CreateSubject from './pages/CreateSubject/CreateSubject'
import SubjectPage from './pages/SubjectPage/SubjectPage'
import MySubjectPage from './pages/MySubjectPage/MySubjectPage'
import SubjectDetailPage from './pages/SubjectDetailPage/SubjectDetailPage'
import SubjectDetailStudentPage from './pages/SubjectDetailStudentPage/SubjectDetailStudentPage'
import Profile from './pages/ProfilePage/ProfilePage'
import ClassroomTimetablePage from './pages/ClassroomTimetablePage/ClassroomTimetablePage'

export default class App extends Component {

  state = {
    authToken: localStorage.getItem('token'),
    isAuthenticated: false, 
  };

  async componentDidMount() {
    const { authToken } = this.state;
    if (authToken) {
      try {
        const response = await axios.get('http://localhost:3001/subject', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        if(response.data.code==="0000"){
          this.setState({ isAuthenticated: true });
        }else{
          this.handleLogout(); 
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }
  }

  handleLogin = (data) => {
    this.setState({ authToken: data.token, isAuthenticated: true });
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('rol', data.rol);
  }

  handleLogout = () => {
    this.setState({ authToken: null, isAuthenticated: false });
    localStorage.clear()
  }

  render() {

    const { isAuthenticated } = this.state;

    return (
        <div className="background-image content">
          <div className="header-wrapper">
            {isAuthenticated ? <UserHeader onLogout={this.handleLogout} /> : <Header />}
          </div>
          <div>
            <Routes>
              <Route path="/" element={
                <div className="d-flex justify-content-center align-items-center min-vh-100">
                  <div className="welcome text-center display-1">
                    <h1 className="display-1">Welcome to UPM Book</h1>
                  </div>
                </div>
              } />
              <Route path="/sign" element={<SignUp />} />
              <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
              <Route path="/classroom" element={<ClassroomPage />} />
              <Route path="/subject" element={<SubjectPage />} />
              <Route path="/classroom/createClass" element={<CreateClass />} />
              <Route path="/subject/createSubject" element={<CreateSubject />} />
              <Route path="/mySubject" element={<MySubjectPage />} />
              <Route path="/subject/professor/:id" element={<SubjectDetailPage />} />
              <Route path="/subject/student/:id" element={<SubjectDetailStudentPage />} />
              <Route path='/profile/:username' element={<Profile />} />
              <Route path="/timetable/classroom/:id" element={<ClassroomTimetablePage />} />
            </Routes>
          </div>
        </div>
    )
  }
}
