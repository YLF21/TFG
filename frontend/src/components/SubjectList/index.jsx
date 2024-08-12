import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Subject from '../Subject'
import ConfirmModal from '../ConfirmModal'
import Notification from '../Notification'

export default function SubjectList() {
  const token = localStorage.getItem('token')
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [dataNotification, setNotification] = useState({
    notification: {
      show: false,
      message: '',
      color: '',
      router:'',
      autoDismiss: false
    }
  })

  const rol = localStorage.getItem('rol')
  const {notification} = dataNotification

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/subject/${rol}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setItems(response.data.data)
      } catch (error) {
        console.error('Error al obtener datos:', error)
      }
    }

    fetchData()
  }, [rol, token])

  const handleShowModal = (id) => {
    setSelectedSubjectId(id)
    setShowModal(true)
  };

  const handleCloseModal = () => {
    setSelectedSubjectId(null)
    setShowModal(false)
  };

  const handleConfirmDelete = async () => {
    try {
      const response  = await axios.delete(`http://localhost:3001/subject/${selectedSubjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data =  response.data

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '/subject' : '',
        autoDismiss: data.code === '0000'
      }

      setNotification({ notification: newNotification })

      setItems(items.filter(item => item._id !== selectedSubjectId))
      handleCloseModal()

      if(data.code==='0000'){
        window.location.reload()
      }
    } catch (error) {
      console.error('Error al eliminar la asignatura:', error)
    }
  };

  return (
    <>
    {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
    <div className="container">
      <div className="row">
        {items.map(item => (
          <div key={item._id} className="col-md-4">
            <Subject {...item} onDelete={handleShowModal} />
          </div>
        ))}
      </div>
      <ConfirmModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmDelete}
      />
    </div>
    </>
  );
}

