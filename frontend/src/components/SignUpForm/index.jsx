import React, { useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import Notification from '../Notification'
import './index.css'

export default function SignUp() {
  const [state, setState] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    admin: false,
    errors: {},
    notification: {
      show: false,
      message: '',
      color: '',
      router: '',
      autoDismiss: false
    }
  });

  const navigate = useNavigate()

  const { username, email, password, confirmPassword, admin, errors, notification } = state

  const validateForm = () => {
    const errors = {}

    if (username.trim() === '') {
      errors.username = 'Username is required'
    }

    if (email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!email.endsWith('@alumnos.upm.es') && !email.endsWith('@upm.es')) {
      errors.email = 'Email must end with @alumnos.upm.es or @upm.es'
    }

    if (password.trim() === '') {
      errors.password = 'Password is required'
    }

    if (confirmPassword.trim() === '') {
      errors.confirmPassword = 'Confirm Password is required'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setState({ ...state, errors });
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const errors = {}

      const response = await axios.post('http://localhost:3001/reg', {
        username,
        email,
        password,
        confirmPassword,
        admin
      });

      const data = response.data

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '/login' : '',
        autoDismiss: data.code === '0000'
      }

      if (data.code === '1006' || data.code === '1007') {
        errors[data.code === '1006' ? 'username' : 'email'] = data.msg;
      }

      setState({ ...state, errors, notification: newNotification });

    } catch (error) {
      console.log('Request error:', error)
    }
  }

  const changeHandle = (type) => (event) => {
    const value = type === 'admin' ? event.target.checked : event.target.value;
    setState({ ...state, [type]: value });
  }

  const canSelectAdmin = email.endsWith('@upm.es');

  return (
    <>
      {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router} />}
      <form className='data-form' onSubmit={onSubmit}>
        <div className='container'>
          <h1 className="text-center mb-4">Sign Up</h1>
          <div className="mb-3">
            <input type="text" className={classnames("form-control", { 'is-invalid': errors.username })} placeholder="Username" value={username} onChange={changeHandle('username')} />
            {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
          </div>
          <div className="mb-3">
            <input type="email" className={classnames("form-control", { 'is-invalid': errors.email })} placeholder="Email" value={email} onChange={changeHandle('email')} />
            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
          </div>
          <div className="mb-3">
            <input type="password" className={classnames("form-control", { 'is-invalid': errors.password })} placeholder="Password" value={password} onChange={changeHandle('password')} />
            {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
          </div>
          <div className="mb-3">
            <input type="password" className={classnames("form-control", { 'is-invalid': errors.confirmPassword })} placeholder="Confirm Password" value={confirmPassword} onChange={changeHandle('confirmPassword')} />
            {errors.confirmPassword && <div className='invalid-feedback'>{errors.confirmPassword}</div>}
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="adminCheck" checked={admin} onChange={changeHandle('admin')} disabled={!canSelectAdmin} />
            <label className="form-check-label" htmlFor="adminCheck">Register as Admin</label>
          </div>
          <button type="submit" className='btn btn-primary btn-block mt-3'>Register</button>
          <p className="text-center mt-2">
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/login')}>Log in</span>
          </p>
        </div>
      </form>
    </>
  )
}
