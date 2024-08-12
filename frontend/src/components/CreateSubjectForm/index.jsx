import React, { useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import Notification from '../Notification';
import './index.css'

export default function CreateSubject() {

  const [state, setState] = useState({
    subjectName: '',
    capacity: '',
    description: '',
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

  const { subjectName, capacity, errors, description, notification } = state

  const validateForm = () => {
    const errors = {}

    if (subjectName.trim() === '') {
      errors.subjectName = 'Subject name is required'
    }

    if (capacity === '0' || capacity.trim() === '') {
      errors.capacity = 'The capacity minimum is 1';
    }

    setState({ ...state, errors });
    return Object.keys(errors).length === 0
  }

  const generateAcronym = (subjectName) => {

    const word = subjectName.split(' ');

    let acronym = '';

    word.forEach(word => {
      if (!(word.toLowerCase() === 'de')){
        acronym += word.charAt(0).toUpperCase();
      }
    });
  
    return acronym;
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token');

    if (!validateForm()) {
      return
    }

    try {
      const errors = {}
      let acronym = generateAcronym(subjectName)

      const response = await axios.post('http://localhost:3001/subject', {
        subjectName,
        acronym,
        capacity,
        description,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '/subject' : '',
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
    navigate('/subject');
  };

  return (
    <>
     {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
    <form className='data-form' onSubmit={onSubmit}>
      <div className='container'>
        <h1 className="text-center mb-4">Create Subject</h1>
        <div className="mb-3">
          <input type="text" className={classnames("form-control", { 'is-invalid': errors.subjectName })} placeholder="Subject name" value={subjectName} onChange={changeHandle('subjectName')} />
          {errors.subjectName && <div className='invalid-feedback'>{errors.subjectName}</div>}
        </div>
        <div className="mb-3">
          <textarea type="text" className='form-control' placeholder="description" value={description} onChange={changeHandle('description')} rows="5" />
        </div>
        <div className="mb-3">
          <input type="number" min="0" className={classnames("form-control", { 'is-invalid': errors.capacity })} placeholder="Capacity" value={capacity} onChange={changeHandle('capacity')} />
          {errors.capacity && <div className='invalid-feedback'>{errors.capacity}</div>}
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
