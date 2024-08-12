import React, { useState, useEffect } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import Notification from '../Notification'

export default function Login(props) {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    errorLogin: '',
    notification: {
      show: false,
      message: '',
      color: '',
      router:'',
      autoDismiss: false
    }
  })

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [navigate, token])

  const { username, password, errorLogin, notification } = formData

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!username || !password) {
      setFormData({ ...formData, errorLogin: 'Please complete all fields' })
      return
    }

    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      const data =  response.data

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '/' : '',
        autoDismiss: data.code === '0000'
      }

      setFormData({ ...formData, errorLogin: '', notification: newNotification })

      if (data.code === '0000') {
        const timer = setTimeout(() => {
          props.onLogin(data.data)
        }, 500)
        return () => clearTimeout(timer)
      }

    } catch (error) {
      console.error('Request error:', error)
    }
  }

  const onChange = (type) => (event) => {
    setFormData({ ...formData, [type]: event.target.value, errorLogin: '' })
  }

  return (
    <>
      {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
      <form className="data-form" onSubmit={onSubmit}>
        <div className="container">
          <h1 className="text-center mb-4">Login</h1>
          <div className="mb-3">
            <input type="text" className={classnames("form-control",{'is-invalid':errorLogin})} placeholder="Username" value={username} onChange={onChange('username')}/>
          </div>
          <div className="mb-3">
            <input type="password" className={classnames("form-control",{'is-invalid':errorLogin})} placeholder="Password" value={password} onChange={onChange('password')}/>
            {errorLogin && <div className="invalid-feedback">{errorLogin}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
          <p className="text-center mt-2">
            Don't have an account?{' '}
            <span className="link" onClick={() => navigate('/sign')}>Sign up</span>
          </p>
        </div>
      </form>
    </> 
  )
}
