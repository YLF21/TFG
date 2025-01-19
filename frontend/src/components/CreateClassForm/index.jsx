import React, { useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import Notification from '../Notification';
import './index.css'

export default function CreateClass(){

  const [state, setState] = useState({
    classroomName: '',
    studentCapacity: '',
    errors: {},
    notification: {
      show: false,
      message: '',
      color: '',
      router:'',
      autoDismiss: false
    },
  });

  const navigate = useNavigate()

  const { classroomName, studentCapacity, errors, notification } = state

  const validateForm = () => {
    const errors = {}

    if (classroomName.trim() === '') {
      errors.classroomName = 'Classroom name is required'
    }

    if (studentCapacity === '0' || studentCapacity.trim() === '') {
      errors.studentCapacity = 'The capacity minimum is 1';
    }

    setState({ ...state, errors });
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token');

    if (!validateForm()) {
      return
    }

    try {
      const errors = {}

      const response = await axios.post('http://localhost:3001/classroom', {
        classroomName,
        studentCapacity,
      },{
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '/classroom' : '',
        autoDismiss: data.code === '0000'
      };

      setState({...state, errors, notification: newNotification });

    } catch (error) {
      console.log('Request error:', error)
    }
  }

  const changeHandle = (type) => (event) => {
    setState({ ...state, [type]: event.target.value })
  }

  const handleCancel = () => {
    navigate('/classroom');
  };

      return (
      <>
       {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
      <form className='data-form' onSubmit={onSubmit}>
        <div className='container'>
          <h1 className="text-center mb-4">Create classroom</h1>
          <div className="mb-3">
            <input type="text" className={classnames("form-control", {'is-invalid':errors.classroomName})} placeholder="Classroom name" value={classroomName} onChange={changeHandle('classroomName')}/>
            {errors.classroomName && <div className='invalid-feedback'>{errors.classroomName}</div>}
          </div>
          <div className="mb-3">
            <input type="number"  min="0" className={classnames("form-control",{'is-invalid':errors.studentCapacity})} placeholder="Classroom Capacity" value={studentCapacity} onChange={changeHandle('studentCapacity')} />
            {errors.studentCapacity && <div className='invalid-feedback'>{errors.studentCapacity}</div>}
          </div>
          <div className="row">
            <div className="col">
              <button type="submit" className='btn btn-primary btn-block'>Create</button>
            </div>
            <div className="col">
              <button type="button" className='btn btn-secondary btn-block' onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
      </>
      )
    
}



