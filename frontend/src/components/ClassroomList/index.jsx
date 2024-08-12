import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Classroom from '../Classroom'
import ConfirmDeleteModal from '../ConfirmModal'
import Notification from '../Notification'

export default function ClassroomList() {
  const token = localStorage.getItem('token')
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const [dataNotification, setNotification] = useState({
    notification: {
      show: false,
      message: '',
      color: '',
      router:'',
      autoDismiss: false
    }
  })

  const {notification} = dataNotification

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/classroom', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setItems(response.data.data);
      } catch (error) {
        console.error('Error in getting data:', error)
      }
    };

    fetchData();
  }, [token]);

  const handleShowModal = (id) => {
    setSelectedClassroomId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedClassroomId(null);
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/classroom/${selectedClassroomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data =  response.data

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '/classroom' : '',
        autoDismiss: data.code === '0000'
      }

      setNotification({ notification: newNotification })

      setItems(items.filter(item => item._id !== selectedClassroomId))
      handleCloseModal();
      if(data.code==='0000'){
        window.location.reload()
      }
    } catch (error) {
      console.error('Error to delete classroom:', error)
    }
  };

  return (
    <>
    {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
    <div className="container">
      <div className="row">
        {items.map(item => (
          <div key={item._id} className="col-md-4">
            <Classroom {...item} onDelete={handleShowModal} />
          </div>
        ))}
      </div>
      <ConfirmDeleteModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmDelete}
      />
    </div>
    </>
  );
}
